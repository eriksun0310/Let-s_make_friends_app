import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  userData: {
    userId: "",
    name: "",
    gender: "female",
    introduce: "",
    headShot: {
      imageUrl: "",
      imageType: "people",
    },
    selectedOption: {
      interests: [""],
      favoriteFood: [""],
      dislikedFood: [""],
    },
    birthday: "",
    email: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action) {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },

    setSelectedOption(state, action) {
      const { currentTab, currentOption } = action.payload;

      const selectedOption = state.userData.selectedOption;
      if (!selectedOption[currentTab]) {
        state.userData.selectedOption[currentTab] = [currentOption];

        // 已經存在 tab
      } else {
        const existingValues = selectedOption[currentTab];

        // 已經存在的選項,移除
        if (existingValues.includes(currentOption)) {
          state.userData.selectedOption = {
            ...state.userData.selectedOption,
            [currentTab]: existingValues.filter(
              (option) => option !== currentOption
            ),
          };

          // 沒有存在的選項，新增
        } else {
          state.userData.selectedOption = {
            ...state.userData.selectedOption,
            [currentTab]: [...existingValues, currentOption],
          };
        }
      }
    },
  },
});

export const { setUserData, setSelectedOption } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.userData;

export default userSlice.reducer;
