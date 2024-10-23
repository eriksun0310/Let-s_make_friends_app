import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { User } from "../shared/types";
import { auth } from "../util/firebaseConfig";
import { getUserData } from "../util/auth";
import { useNavigation } from "@react-navigation/native";

interface InitialStateProps {
  user: User;
  isAuthenticated: boolean;
  initialized: boolean;
}

const initialState: InitialStateProps = {
  user: {
    userId: "",
    name: "",
    gender: "female",
    introduce: "",
    headShot: {
      imageUrl: "",
      imageType: "people",
    },
    selectedOption: {
      interests: [],
      favoriteFood: [],
      dislikedFood: [],
    },
    birthday: "",
    email: "",
  },
  isAuthenticated: false, // 是否已經登入
  initialized: false, // 應用程序這個初始化步驟已完成,
};

// slice 定義
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },

    setInitialized(state, action) {
      state.initialized = action.payload;
    },

    setSelectedOption(state, action) {
      const { currentTab, currentOption } = action.payload;

      const selectedOption = state.user.selectedOption;
      if (!selectedOption[currentTab]) {
        state.user.selectedOption[currentTab] = [currentOption];

        // 已經存在 tab
      } else {
        const existingValues = selectedOption[currentTab];

        // 已經存在的選項,移除
        if (existingValues.includes(currentOption)) {
          state.user.selectedOption = {
            ...state.user.selectedOption,
            [currentTab]: existingValues.filter(
              (option) => option !== currentOption
            ),
          };

          // 沒有存在的選項，新增
        } else {
          state.user.selectedOption = {
            ...state.user.selectedOption,
            [currentTab]: [...existingValues, currentOption],
          };
        }
      }
    },
  },
});

// 將 logout 定義為一個 thunk，用來登出用戶(因為非同步操作，所以用 thunk)
export const logout = (): AppThunk => async (dispatch) => {
  try {
    await auth.signOut(); // 登出
    dispatch(userSlice.actions.setUser(initialState.user)); // 清除用戶信息
    dispatch(userSlice.actions.setIsAuthenticated(false)); // 設置為未認證

    return Promise.resolve();
  } catch (error) {
    console.log("error", error);
    return Promise.reject(error);
  }
};

// 定義 initializeAuth 為一個 thunk，用來在每次應用程式啟動時檢查 Firebase 認證狀態
export const initializeAuth = (): AppThunk => async (dispatch) => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userData = await getUserData(user.uid);

      if (userData) {
        dispatch(userSlice.actions.setUser(userData));
      } else {
        dispatch(
          userSlice.actions.setUser({ userId: user.uid, email: user.email })
        );
      }

      // 如果有用戶已登入，更新用戶信息並設置為已認證
      dispatch(userSlice.actions.setIsAuthenticated(true));
    } else {
      // 如果用戶沒有登入，設置為未認證
      dispatch(userSlice.actions.setIsAuthenticated(false));
    }
    // 無論有無用戶，初始化流程完成
    dispatch(userSlice.actions.setInitialized(true));
  });
};
export const { setUser, setSelectedOption } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
