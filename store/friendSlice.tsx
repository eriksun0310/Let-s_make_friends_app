import { createSlice } from "@reduxjs/toolkit";
import { FriendRequest, User } from "shared/types";
import { RootState } from "./store";
interface InitialStateProps {
  beAddFriends: User[]; // 可以加好友的用戶列表
  friendList: User[]; // 好友列表
  friendRequests: FriendRequest[]; // 交友邀請列表
  friendRequestUnRead: number; // 交友邀請未讀數量
  newFriendUnRead: number; // 新好友未讀數量
}

const initialState: InitialStateProps = {
  beAddFriends: [],
  friendList: [],
  friendRequests: [],
  friendRequestUnRead: 0,
  newFriendUnRead: 0,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setBeAddFriends(state, action) {
      state.beAddFriends = action.payload;
    },
    // ex: for 有新用戶的加入
    addBeAddFriend(state, action) {
      state.beAddFriends = [...state.beAddFriends, action.payload];
    },

    // ex: 用戶換了大頭貼
    updateBeAddFriend(state, action) {
      const updateUser = action.payload;
      state.beAddFriends = state.beAddFriends.map((friend) =>
        friend.userId === updateUser.userId ? updateUser : friend
      );
    },

    // ex: 有任一用戶 在 加好友頁面 刪除好友
    deleteBeAddFriend(state, action) {
      state.beAddFriends = state.beAddFriends.filter(
        (friend) => friend.userId !== action.payload
      );
    },

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

    deleteFriend(state, action) {
      state.friendList = state.friendList.filter(
        (friend) => friend.userId !== action.payload
      );
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
      state.newFriendUnRead = action.payload;
    },
    updateNewFriendUnRead(state) {
      state.newFriendUnRead += 1;
    },
  },
});

export const {
  setFriendList,
  addFriend,
  deleteFriend,
  setFriendRequests,
  addFriendRequest,
  deleteFriendRequest,
  setFriendRequestUnRead,
  updateFriendRequestUnRead,
  setNewFriendUnRead,
  updateNewFriendUnRead,
  setBeAddFriends,
  addBeAddFriend,
  updateBeAddFriend,
  deleteBeAddFriend,
} = friendSlice.actions;

export const selectBeAddFriends = (state: RootState) =>
  state.friend.beAddFriends;

export const selectFriendList = (state: RootState) => state.friend.friendList;

export const selectFriendRequests = (state: RootState) =>
  state.friend.friendRequests;

export const selectFriendRequestUnRead = (state: RootState) =>
  state.friend.friendRequestUnRead;

export const selectNewFriendUnRead = (state: RootState) =>
  state.friend.newFriendUnRead;

export default friendSlice.reducer;
