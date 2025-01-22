import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppThunk, RootState } from "./store";
import { User, UserSettings } from "../shared/types";
import { getUserDetail } from "../util/handleUserEvent";
import { supabase } from "../util/supabaseClient";
import { initUserSettings } from "../shared/static";
import { fetchAllData } from "shared/fetchData";

interface InitialStateProps {
  user: User;
  isAuthenticated: boolean; // 是否已經登入
  initialized: boolean; // 應用程序這個初始化步驟已完成
  isNewUser: boolean; // 是否是新用戶
  userSettings: UserSettings;
}

export const initialState: InitialStateProps = {
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

export const {
  setUser,
  setSelectedOption,
  setIsAuthenticated,
  setUserSettings,
  setInitialized,
  setIsNewUser,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export const selectIsNewUser = (state: RootState) => state.user.isNewUser;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectInitialized = (state: RootState) => state.user.initialized;

export const selectUserSettings = (state: RootState) => state.user.userSettings;

export default userSlice.reducer;
