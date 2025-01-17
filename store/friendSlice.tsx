import { createSlice } from "@reduxjs/toolkit";
import { FriendRequest, User } from "shared/types";
import { RootState } from "./store";

interface InitialStateProps {
  friendList: User[]; // 好友列表
  friendRequests: FriendRequest[]; // 交友邀請列表
  friendRequestUnRead: number; // 交友邀請未讀數量
  newFriendUnRead: number; // 新好友未讀數量
}

const initialState: InitialStateProps = {
  friendList: [],
  friendRequests: [],
  friendRequestUnRead: 0,
  newFriendUnRead: 0,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriendList(state, action) {
      state.friendList = action.payload;
    },

    addFriend(state, action) {
      // 如果好友存在的話 更新
      const index = state.friendList.findIndex(
        (friend) => friend.userId === action.payload.userId
      );

      // 如果好友不存在的話 新增
      if (index === -1) {
        state.friendList.push(action.payload);
      } else {
        state.friendList[index] = action.payload;
      }
    },

    setFriendRequests(state, action) {
      // state.friendRequests = action.payload;
    },

    addFriendRequest(state, action) {
      // state.friendRequests.push(action.payload);
    },

    setFriendRequestUnRead(state, action) {
      // state.friendRequestUnRead = action.payload;
    },
    updateFriendRequestUnRead(state, action) {
      // state.friendRequestUnRead = action.payload;
    },

    setNewFriendUnRead(state, action) {
      // state.newFriendUnRead = action.payload;
    },
    updateNewFriendUnRead(state, action) {
      // state.newFriendUnRead = action.payload;
    },
  },
});

export const {
  setFriendList,
  addFriend,
  setFriendRequests,
  addFriendRequest,
  setFriendRequestUnRead,
  updateFriendRequestUnRead,
  setNewFriendUnRead,
  updateNewFriendUnRead,
} = friendSlice.actions;

export const selectFriendList = (state: RootState) => state.friend.friendList;

export const selectFriendRequest = (state: RootState) =>
  state.friend.friendRequests;

export const selectFriendRequestUnRead = (state: RootState) =>
  state.friend.friendRequestUnRead;

export const selectNewFriendUnRead = (state: RootState) =>
  state.friend.newFriendUnRead;

export default friendSlice.reducer;
