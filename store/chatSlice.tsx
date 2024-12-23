import { createSlice } from "@reduxjs/toolkit";
import { User } from "../shared/types";
import { getFriendDetail } from "../util/handleFriendsEvent";
import { RootState } from "./store";
import { getChatRoomDetail } from "../util/handleChatEvent";

type ChatRoom = {
  id: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  unreadCountUser1: number;
  unreadCountUser2: number;
  user1Deleted: boolean;
  user2Deleted: boolean;
  user1DeletedAt: Date;
  user2DeletedAt: Date;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  friend: User;
};

interface InitialStateProps {
  chatRooms: ChatRoom[];
  currentChatRoomId?: string | null;
}

//TODO: 要定義 聊天室的type
const initialState: InitialStateProps = {
  chatRooms: [],
  currentChatRoomId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChatRoomId(state, action) {
      state.currentChatRoomId = action.payload;
    },

    setChatRooms(state, action) {
      // console.log("setChatRooms 1", action.payload);
      // console.log("setChatRooms 2", state.chatRooms);

      state.chatRooms = action.payload;
    },
    addChatRoom(state, action) {
      const incomingRoom = action.payload;
      const index = state.chatRooms.findIndex(
        (room) => room.id === incomingRoom.id
      );

      // 如果聊天室不存在,添加
      if (index === -1) {
        state.chatRooms.push(incomingRoom);

        //聊天室已存在,更新數據
      } else {
        state.chatRooms[index] = {
          ...state.chatRooms[index],
          ...incomingRoom,
        };
      }

      // 排序聊天室, 按照最後一則訊息的時間排序
      state.chatRooms.sort(
        (a, b) =>
          new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
      );
    },

    // 更新聊天室(未讀訊息數量、最後一則訊息、最後一則訊息時間)
    updateChatRoom(state, action) {
      const {
        id,
        lastMessage,
        lastTime,
        incrementUser1,
        incrementUser2,
        user1Deleted,
        user1DeletedAt,
        user2Deleted,
        user2DeletedAt,
      } = action.payload;

      // 找出對應的聊天室
      const chatRoom = state.chatRooms.find((room) => room.id === id);

      // 如果聊天室存在
      if (chatRoom) {
        // 更新最後訊息和時間
        chatRoom.lastMessage = lastMessage;
        chatRoom.lastTime = lastTime;
        chatRoom.unreadCountUser1 += incrementUser1 || 0;
        chatRoom.unreadCountUser2 += incrementUser2 || 0;
        chatRoom.user1Deleted = user1Deleted;
        chatRoom.user1DeletedAt = user1DeletedAt;
        chatRoom.user2Deleted = user2Deleted;
        chatRoom.user2DeletedAt = user2DeletedAt;
      }
    },

    // 清零自己的未讀數量
    resetUnreadUser(state, action) {
      const { chatRoomId, resetUnreadUser1, resetUnreadUser2 } = action.payload;
      // 找出對應的聊天室
      const chatRoom = state.chatRooms.find((room) => room.id === chatRoomId);

      if (chatRoom) {
        // 重置未讀數量
        if (resetUnreadUser1) {
          chatRoom.unreadCountUser1 = 0;
        }
        if (resetUnreadUser2) {
          chatRoom.unreadCountUser2 = 0;
        }
      }
    },

    // 刪除單一聊天室
    deleteChatRoom(state, action) {
      state.chatRooms = state.chatRooms.filter(
        (room) => room.id !== action.payload
      );
    },
  },
});

export const {
  setChatRooms,
  addChatRoom,
  updateChatRoom,
  resetUnreadUser,
  setCurrentChatRoomId,
  deleteChatRoom,
} = chatSlice.actions;

export const updateOrCreateChatRoom =
  (payload) => async (dispatch, getState) => {
    const {
      id,
      user1Id,
      user2Id,
      lastMessage,
      lastTime,
      incrementUser1,
      incrementUser2,
    } = payload;
    const state = getState();
    const chatRoom = state.chat.chatRooms.find((room) => room.id === id);

    // 取得聊天室詳細資料
    const chatRoomDetail = await getChatRoomDetail(id);

    console.log("chatRoomDetail 1111111111111", chatRoomDetail);
    // 更新聊天室
    if (chatRoom) {
      dispatch(
        updateChatRoom({
          id,
          user1Id,
          user2Id,
          lastMessage,
          lastTime,
          incrementUser1,
          incrementUser2,
          user1Deleted: chatRoomDetail.user1_deleted,
          user1DeletedAt: chatRoomDetail.user1_deleted_at,
          user2Deleted: chatRoomDetail.user2_deleted,
          user2DeletedAt: chatRoomDetail.user2_deleted_at,
        })
      );
    } else {
      // 新增聊天室
      const friend = await getFriendDetail(user1Id); // 非同步操作
      dispatch(
        addChatRoom({
          id,
          user1Id,
          user2Id,
          lastMessage,
          lastTime: lastTime,
          unreadCountUser1: incrementUser1 || 0,
          unreadCountUser2: incrementUser2 || 0,
          friend,
          user1Deleted: chatRoomDetail.user1_deleted,
          user1DeletedAt: chatRoomDetail.user1_deleted_at,
          user2Deleted: chatRoomDetail.user2_deleted,
          user2DeletedAt: chatRoomDetail.user2_deleted_at,
        })
      );
    }
  };

export const selectChatRooms = (state: RootState) => state.chat.chatRooms;

export const selectCurrentChatRoomId = (state: RootState) =>
  state.chat.currentChatRoomId;

export default chatSlice.reducer;
