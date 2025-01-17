import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import postReducer from "./postSlice";
import friendSlice from "./friendSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    post: postReducer,
    friend: friendSlice,
  },
});

// 定義 RootState 和 AppDispatch 類型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
