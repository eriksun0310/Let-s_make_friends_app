import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { User, UserSettings } from "../shared/types";
import { getUserDetail } from "../util/handleUserEvent";
import { supabase } from "../util/supabaseClient";
import { initUserSettings } from "../shared/static";

interface InitialStateProps {
  user: User;
  isAuthenticated: boolean; // 是否已經登入
  initialized: boolean; // 應用程序這個初始化步驟已完成
  isNewUser: boolean; // 是否是新用戶
  userSettings: UserSettings;
}

const initialState: InitialStateProps = {
  user: {
    userId: "",
    name: "",
    gender: "female",
    introduce: "",
    birthday: "",
    email: "",
    headShot: {
      imageUrl: "",
      imageType: "people",
    },
    selectedOption: {
      interests: [],
      favoriteFood: [],
      dislikedFood: [],
    },
  },
  isAuthenticated: false, // 是否已經登入
  initialized: false, // 應用程序這個初始化步驟已完成,
  isNewUser: false,
  userSettings: initUserSettings,
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

    setIsNewUser(state, action) {
      state.isNewUser = action.payload;
    },
    setUserSettings(state, action) {
      state.userSettings = action.payload;
    },
  },
});

// 將 logout 定義為一個 thunk，用來登出用戶(因為非同步操作，所以用 thunk)
export const logout = () => async (dispatch: any) => {
  try {
    await supabase.auth.signOut();
    dispatch(userSlice.actions.setUser(initialState.user)); // 清除用戶信息
    dispatch(userSlice.actions.setIsAuthenticated(false)); // 設置為未認證

    return Promise.resolve();
  } catch (error) {
    console.log("error", error);
    return Promise.reject(error);
  }
};

// 定義 initializeAuth 為一個 thunk，用來在每次應用程式啟動時檢查 Supabase 認證狀態
export const initializeAuth = (): AppThunk => async (dispatch) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("current session 1111111111", session);

    // const session = supabase.auth.session();
    // 使用 onAuthStateChange 來監聽認證狀態變化
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("session", session);
      // 不管是註冊還是登入都會有 session
      if (session) {
        const user = session.user;
        const { data: userData } = await getUserDetail({
          userId: user.id,
        }); // 取得用戶資料

        // 舊用戶登入
        if (userData) {
          dispatch(userSlice.actions.setUser(userData));
          dispatch(userSlice.actions.setIsNewUser(false));
        } else {
          // 新用戶登入

          dispatch(
            userSlice.actions.setUser({
              userId: user.id,
              email: user.email,
            })
          );
          dispatch(userSlice.actions.setIsNewUser(true));
        }

        dispatch(userSlice.actions.setIsAuthenticated(true)); // 設置用戶為已認證
      } else {
        // 用戶未登入
        dispatch(userSlice.actions.setIsAuthenticated(false)); // 設置用戶為未認證
      }

      // 初始化完成
      dispatch(userSlice.actions.setInitialized(true));
    });
  } catch (err) {
    console.log("initializeAuth error", err);
  }
};
export const {
  setUser,
  setSelectedOption,
  setIsAuthenticated,
  setUserSettings,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export const selectIsNewUser = (state: RootState) => state.user.isNewUser;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectInitialized = (state: RootState) => state.user.initialized;

export const selectUserSettings = (state: RootState) => state.user.userSettings;

export default userSlice.reducer;
