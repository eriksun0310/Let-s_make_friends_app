import { createSlice } from "@reduxjs/toolkit";
import { User } from "../shared/types";
import { formatTimeWithDayjs } from "../shared/funcs";

type ChatRoom = {
  id: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  unreadCountUser1: number;
  unreadCountUser2: number;
  user1Deleted: boolean;
  user2Deleted: boolean;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  friend: User;
};

interface InitialStateProps {
  chatRooms: ChatRoom[];
}

//TODO: 要定義 聊天室的type
const initialState: InitialStateProps = {
  chatRooms: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRooms(state, action) {
      state.chatRooms = action.payload;
    },
    addChatRoom(state, action) {
      state.chatRooms.push(action.payload);
    },

    // 更新聊天室(未讀訊息數量、最後一則訊息、最後一則訊息時間)
    updateChatRoom(state, action) {
      const {
        chatRoomId,
        lastMessage,
        lastTime,
        incrementUser1,
        incrementUser2,
      } = action.payload;
      // 找出對應的聊天室
      const chatRoom = state.chatRooms.find((room) => room.id === chatRoomId);

      if (chatRoom) {
        // 更新最後訊息和時間
        chatRoom.lastMessage = lastMessage;
        chatRoom.lastTime = formatTimeWithDayjs(lastTime);
        chatRoom.unreadCountUser1 += incrementUser1 || 0;
        chatRoom.unreadCountUser2 += incrementUser2 || 0;
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

    // 清空聊天室的未讀訊息數量
    // clearUnreadCount(state, action) {
    //   const { chatRoomId } = action.payload;
    //   // 找出對應的聊天室
    //   const chatRoom = state.chatRooms.find((room) => room.id === chatRoomId);

    //   if (chatRoom) {
    //     chatRoom.unreadCount = 0;
    //   }
    // },
  },
});

export const { setChatRooms, addChatRoom, updateChatRoom, resetUnreadUser } =
  chatSlice.actions;

export const selectChatRooms = (state: any) => state.chat;

export default chatSlice.reducer;
