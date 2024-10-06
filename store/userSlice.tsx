import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
  userData: {
    userID: "11111",
    name: "lin",
    gender: "female",
    introduce: "Hi",
    headShot: {
      imageUrl: "",
      imageType: "people",
    },
    selectedOption: {
      interests: ["reading"],
      favoriteFood: ["chocolate"],
      dislikedFood: ["coriander"],
    },
    birthday: "2000-01-01",
    age: 24,
    email: "123@qq.com",
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

export const { setUserData, setSelectedOption } =
  userSlice.actions;
export const selectUser = (state: RootState) => state.user.userData;

export default userSlice.reducer;
