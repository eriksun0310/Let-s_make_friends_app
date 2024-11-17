import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { User } from "../shared/types";
import { auth } from "../util/firebaseConfig";
import { getUserData } from "../util/personApi";
import { supabase } from "../util/supabaseClient";

interface InitialStateProps {
  user: User;
  isAuthenticated: boolean; // 是否已經登入
  initialized: boolean; // 應用程序這個初始化步驟已完成
  isNewUser: boolean; // 是否是新用戶
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
// export const initializeAuth = (): AppThunk => async (dispatch) => {
//   // const navigation = useNavigation()
//   auth.onAuthStateChanged(async (user) => {
//     if (user) {
//       const userData = await getUserData(user.uid);

//       // 舊用戶登入
//       if (userData) {
//         dispatch(userSlice.actions.setUser(userData));
//         dispatch(userSlice.actions.setIsNewUser(false));

//         // 新用戶登入
//       } else {
//         dispatch(
//           userSlice.actions.setUser({ userId: user.uid, email: user.email })
//         );
//         dispatch(userSlice.actions.setIsNewUser(true));
//       }

//       dispatch(userSlice.actions.setIsAuthenticated(true));
//     } else {
//       // 如果用戶沒有登入，設置為未認證
//       dispatch(userSlice.actions.setIsAuthenticated(false));
//     }
//     // 無論有無用戶，初始化流程完成
//     dispatch(userSlice.actions.setInitialized(true));
//   });
// };

// 定義 initializeAuth 為一個 thunk，用來在每次應用程式啟動時檢查 Supabase 認證狀態
export const initializeAuth = (): AppThunk => async (dispatch) => {
  // 使用 onAuthStateChange 來監聽認證狀態變化
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const user = session.user;
      const userData = await getUserData({
        userId: user.id,
      }); // 取得用戶資料

      // 舊用戶登入
      if (userData) {
        dispatch(userSlice.actions.setUser(userData));
        dispatch(userSlice.actions.setIsNewUser(false));
      } else {
        // 新用戶登入

        // await createNewUser({ userId: user.id, email: user.email });
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

  // 確保在應用啟動時進行一次認證狀態的檢查
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (user) {
  //   // 如果用戶已經登入過
  //   const userData = await getUserData(user.id); // 取得用戶資料
  //   if (userData) {
  //     dispatch(userSlice.actions.setUser(userData));
  //     dispatch(userSlice.actions.setIsNewUser(false));
  //   } else {
  //     // 新用戶登入
  //     dispatch(
  //       userSlice.actions.setUser({
  //         userId: user.id,
  //         email: user.email,
  //       })
  //     );
  //     dispatch(userSlice.actions.setIsNewUser(true));
  //   }

  //   dispatch(userSlice.actions.setIsAuthenticated(true)); // 設置用戶為已認證
  // } else {
  //   dispatch(userSlice.actions.setIsAuthenticated(false)); // 設置用戶為未認證
  // }

  // // 設置初始化完成標記
  // dispatch(userSlice.actions.setInitialized(true));
};

// export const initializeAuth = (): AppThunk => async (dispatch) => {
//   // 使用 onAuthStateChange 來監聽認證狀態變化
//   supabase.auth.onAuthStateChange(async (event, session) => {
//     console.log("event", event);
//     console.log("session", session);

//     if (event === "SIGNED_IN" && session) {
//       const user = session.user;

//       // 檢查用戶是否存在
//       const userData = await getUserData({
//         userId: user.id,
//         email: user.email,
//       });

//       if (userData) {
//         // 舊用戶登入
//         dispatch(userSlice.actions.setUser(userData));
//         dispatch(userSlice.actions.setIsNewUser(false));
//       } else {
//         await createNewUser({ userId: user.id, email: user.email });
//         // 新用戶登入
//         dispatch(
//           userSlice.actions.setUser({
//             userId: user.id,
//             email: user.email,
//           })
//         );
//         dispatch(userSlice.actions.setIsNewUser(true));
//       }

//       dispatch(userSlice.actions.setIsAuthenticated(true)); // 設置用戶為已認證
//     } else if (event === "SIGNED_OUT") {
//       dispatch(userSlice.actions.setIsAuthenticated(false)); // 用戶未登入
//     }

//     // 設置初始化完成標記
//     dispatch(userSlice.actions.setInitialized(true));
//   });

//   // 應用啟動時進行一次認證狀態的檢查
//   const { data, error } = await supabase.auth.getUser();

//   if (data.user) {
//     const user = data.user;
//     const userData = await getUserData({
//       userId: user.id,
//       email: user.email,
//     });

//     if (userData) {
//       dispatch(userSlice.actions.setUser(userData));
//       dispatch(userSlice.actions.setIsNewUser(false));
//     } else {
//       dispatch(
//         userSlice.actions.setUser({
//           userId: user.id,
//           email: user.email,
//         })
//       );
//       dispatch(userSlice.actions.setIsNewUser(true));
//     }

//     dispatch(userSlice.actions.setIsAuthenticated(true));
//   } else {
//     dispatch(userSlice.actions.setIsAuthenticated(false));
//   }

//   dispatch(userSlice.actions.setInitialized(true));
// };
export const { setUser, setSelectedOption, setIsAuthenticated } =
  userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
