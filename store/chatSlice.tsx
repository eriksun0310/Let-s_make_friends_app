import { createSlice } from "@reduxjs/toolkit";
import { User } from "../shared/types";
import { formatTimeWithDayjs } from "../shared/funcs";
import { getFriendDetail } from "../util/handleFriendsEvent";
import { RootState } from "./store";

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
      const roomExists = state.chatRooms.some(
        (room) => room.id === action.payload.id
      );

      if (!roomExists) {
        state.chatRooms.push(action.payload);
      } else {
        console.log("聊天室已存在");
      }
    },

    // 更新聊天室(未讀訊息數量、最後一則訊息、最後一則訊息時間)
    updateChatRoom(state, action) {
      const { id, lastMessage, lastTime, incrementUser1, incrementUser2 } =
        action.payload;

      // 找出對應的聊天室
      const chatRoom = state.chatRooms.find((room) => room.id === id);

      // 如果聊天室存在
      if (chatRoom) {
        //console.log("Before update:", { ...chatRoom });
        // 更新最後訊息和時間
        chatRoom.lastMessage = lastMessage;
        chatRoom.lastTime = formatTimeWithDayjs(lastTime);
        chatRoom.unreadCountUser1 += incrementUser1 || 0;
        chatRoom.unreadCountUser2 += incrementUser2 || 0;
        //console.log("After update:", { ...chatRoom });
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

export const {
  setChatRooms,
  addChatRoom,
  updateChatRoom,
  resetUnreadUser,
  setCurrentChatRoomId,
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
          lastTime: formatTimeWithDayjs(lastTime),
          unreadCountUser1: incrementUser1 || 0,
          unreadCountUser2: incrementUser2 || 0,
          friend,
        })
      );
    }
  };

export const selectChatRooms = (state: RootState) => state.chat.chatRooms;

export const selectCurrentChatRoomId = (state: RootState) =>
  state.chat.currentChatRoomId;

export default chatSlice.reducer;
