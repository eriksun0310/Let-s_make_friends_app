import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { HeadShot, SelectedOption, User } from "../shared/types";



const initialState: User = {
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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state = {
        ...state,
        ...action.payload,
      };
    },

    setSelectedOption(state, action) {
      const { currentTab, currentOption } = action.payload;

      const selectedOption = state.selectedOption;
      if (!selectedOption[currentTab]) {
        state.selectedOption[currentTab] = [currentOption];

        // 已經存在 tab
      } else {
        const existingValues = selectedOption[currentTab];

        // 已經存在的選項,移除
        if (existingValues.includes(currentOption)) {
          state.selectedOption = {
            ...state.selectedOption,
            [currentTab]: existingValues.filter(
              (option) => option !== currentOption
            ),
          };

          // 沒有存在的選項，新增
        } else {
          state.selectedOption = {
            ...state.selectedOption,
            [currentTab]: [...existingValues, currentOption],
          };
        }
      }
    },
  },
});

export const { setUser, setSelectedOption } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
