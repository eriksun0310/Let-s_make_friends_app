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
        state.friendList = [...state.friendList, action.payload];
      } else {
        state.friendList = state.friendList.map((friend, idx) =>
          idx === index ? action.payload : friend
        );
      }
    },

    setFriendRequests(state, action) {
      state.friendRequests = action.payload;
    },

    addFriendRequest(state, action) {
      const newFriendRequest = action.payload;
      const isExist = state.friendRequests.some(
        (req) => req.id === newFriendRequest.id
      );

      if (!isExist) {
        state.friendRequests = [...state.friendRequests, ...newFriendRequest];
      }
    },

    deleteFriendRequest(state, action) {
      state.friendRequests = state.friendRequests.filter(
        (req) => req.id !== action.payload
      );
    },

    setFriendRequestUnRead(state, action) {
      state.friendRequestUnRead = action.payload;
    },
    updateFriendRequestUnRead(state) {
      state.friendRequestUnRead += 1;
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
  deleteFriendRequest,
  setFriendRequestUnRead,
  updateFriendRequestUnRead,
  setNewFriendUnRead,
  updateNewFriendUnRead,
} = friendSlice.actions;

export const selectFriendList = (state: RootState) => state.friend.friendList;

export const selectFriendRequests = (state: RootState) =>
  state.friend.friendRequests;

export const selectFriendRequestUnRead = (state: RootState) =>
  state.friend.friendRequestUnRead;

export const selectNewFriendUnRead = (state: RootState) =>
  state.friend.newFriendUnRead;

export default friendSlice.reducer;
