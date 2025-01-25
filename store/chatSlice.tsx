import { createSlice } from "@reduxjs/toolkit";
import { ChatRoom, Message } from "../shared/types";
import { RootState } from "./store";
import { getChatRoomDetail } from "../util/handleChatEvent";

/*
messages:{
  [chatRoomId]: [ Message, Message, Message],

}
*/
import { getUserDetail } from "../util/handleUserEvent";
import { update } from "firebase/database";
interface InitialStateProps {
  chatRooms: ChatRoom[];
  currentChatRoomId?: string | null;
  onlineUsers: string[]; // 儲存在線用戶
  messages: Record<string, Message[]>;
}

//TODO: 要定義 聊天室的type
const initialState: InitialStateProps = {
  chatRooms: [],
  currentChatRoomId: null,
  onlineUsers: [],
  messages: {},
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
    // 新增聊天室-origin
    // addChatRoom(state, action) {
    //   const incomingRoom = action.payload;
    //   const index = state.chatRooms.findIndex(
    //     (room) => room.id === incomingRoom.id
    //   );

    //   // 如果聊天室不存在,添加
    //   if (index === -1) {
    //     state.chatRooms = [...state.chatRooms, incomingRoom];
    //     //聊天室已存在,更新數據
    //   } else {
    //     // TODO: 新增聊天室 要看說是不是部分更新
    //     // state.chatRooms = state.chatRooms.map((room, idx) =>
    //     //   idx === index ? { ...room, ...incomingRoom } : room
    //     // );

    //     //  還是 說incomingRoom 有帶完整資訊就可以用這個方法
    //     state.chatRooms = state.chatRooms.map((room, idx) =>
    //       idx === index ? incomingRoom : room
    //     );
    //   }

    //   // 排序聊天室, 按照最後一則訊息的時間排序
    //   state.chatRooms.sort(
    //     (a, b) =>
    //       new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    //   );
    // },

    addChatRoom(state, action) {
      const incomingRoom = action.payload;
      const index = state.chatRooms.findIndex(
        (room) => room.id === incomingRoom.id
      );

      // 如果聊天室不存在,添加
      if (index === -1) {
        state.chatRooms = [...state.chatRooms, incomingRoom];
        //聊天室已存在,更新數據
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

      // 找出對應的聊天室的索引
      const index = state.chatRooms.findIndex((room) => room.id === id);

      // 如果聊天室存在
      if (index !== -1) {
        const chatRoom = state.chatRooms[index];
        // 更新聊天室
        chatRoom.lastMessage = lastMessage;
        chatRoom.lastTime = lastTime;
        chatRoom.unreadCountUser1 += incrementUser1 || 0;
        chatRoom.unreadCountUser2 += incrementUser2 || 0;
        chatRoom.user1Deleted = user1Deleted;
        chatRoom.user1DeletedAt = user1DeletedAt;
        chatRoom.user2Deleted = user2Deleted;
        chatRoom.user2DeletedAt = user2DeletedAt;
      }

      // 排序聊天室, 按照最後一則訊息的時間排序
      state.chatRooms.sort(
        (a, b) =>
          new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
      );
    },

    // 更新聊天室(未讀訊息數量、最後一則訊息、最後一則訊息時間)
    updateChatRoomLastMessage(state, action) {
      const message = action.payload as Message;

      const index = state.chatRooms.findIndex(
        (room) => room.id === message.chatRoomId
      );

      // 如果聊天室存在
      if (index !== -1) {
        const chatRoom = state.chatRooms[index];
        chatRoom.lastMessage = message.content;
        chatRoom.lastTime = message.createdAt;
      }

      // if (state.messages[message.chatRoomId]) {
      //   state.messages[message.chatRoomId] = [
      //     ...state.messages[message.chatRoomId],
      //     message,
      //   ];
      // }
    },

    // 更新聊天室未讀數量
    updateChatRoomUnreadCount(state, action) {
      // TODO: 需要判斷要對誰的未讀數量進行更新
      const { chatRoomId, recipientId } = action.payload;
      state.chatRooms = state.chatRooms.map((room) => {
        const unreadCountUser =
          room.user1Id === recipientId
            ? "unreadCountUser1"
            : "unreadCountUser2";
        return room.id === chatRoomId
          ? {
              ...room,
              [unreadCountUser]: (room?.[unreadCountUser] || 0) + 1,
            }
          : room;
      });
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

    // ☑️ 刪除聊天室 及聊天室中的所有訊息
    deleteChatRoom(state, action) {
      const deleteChatRoomId = action.payload;
      // 刪除聊天室
      state.chatRooms = state.chatRooms.filter(
        (room) => room.id !== deleteChatRoomId
      );
      // TODO:刪除聊天室中的所有訊息
      if (state.messages[deleteChatRoomId]) {
        delete state.messages[deleteChatRoomId];
      }
    },

    // ☑️
    setMessage(state, action) {
      const messages = action.payload as Message[];
      console.log("messages 00000000000000000", messages);
      messages.forEach((message) => {
        console.log("message 11111111111111111111111", message);
        const chatRoomId = message.chatRoomId;

        // 初始化聊天室的消息列表（如果尚未存在）
        if (!state.messages[chatRoomId]) {
          state.messages[chatRoomId] = [];
        }

        // 檢查訊息是否已存在於該聊天室
        const existingMessage = state.messages[chatRoomId].find(
          (msg) => msg.id === message.id
        );
        if (!existingMessage) {
          state.messages[chatRoomId] = [...state.messages[chatRoomId], message];
        }
      });

      console.log("state.messages 22222222222", state.messages);
    },
    // ☑️ 新增訊息
    addMessage(state, action) {
      const message = action.payload as Message;
      const chatRoomId = message.chatRoomId;

      console.log("chatRoomId", chatRoomId);
      console.log("message", message);
      // 如果聊天室不存在
      if (!state.messages[chatRoomId]) {
        // 為新的聊天室創建一個消息列表
        state.messages[chatRoomId] = [message];

        // 向現有的聊天室消息列表添加新的消息
      } else {
        state.messages[chatRoomId] = [...state.messages[chatRoomId], message];
        //state.messages[chatRoomId].push(message);
      }
    },
    // updateMessage(state, action) {},
    // ☑️ 更新訊息的已讀狀態
    updateMessageIsRead(state, action) {
      const { chatRoomId, id } = action.payload as Message;

      // 如果聊天室不存在
      if (!state.messages[chatRoomId]) return;

      // 更新指定消息的 isRead 狀態
      state.messages[chatRoomId] = state.messages[chatRoomId].map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      );
    },
    setUserOnline(state, action) {
      const index = state.onlineUsers.findIndex(
        (userId) => userId === action.payload
      );
      if (index === -1) {
        state.onlineUsers.push(action.payload);
      }
    },
    setUserOffline(state, action) {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },
  },
});

export const {
  setChatRooms,
  addChatRoom,
  updateChatRoom,
  updateChatRoomLastMessage,
  updateChatRoomUnreadCount,
  resetUnreadUser,
  setCurrentChatRoomId,
  deleteChatRoom,
  setMessage,
  addMessage,
  // updateMessage,
  updateMessageIsRead,
  setUserOnline,
  setUserOffline,
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
    const { data: chatRoomDetail } = await getChatRoomDetail({
      chatRoomId: id,
    });

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
          user1Deleted: chatRoomDetail?.user1Deleted,
          user1DeletedAt: chatRoomDetail?.user1DeletedAt,
          user2Deleted: chatRoomDetail?.user2Deleted,
          user2DeletedAt: chatRoomDetail?.user2DeletedAt,
        })
      );
    } else {
      const personal = state.user.user;

      const friendId =
        personal.userId === chatRoomDetail?.user1Id
          ? chatRoomDetail?.user2Id
          : chatRoomDetail?.user1Id;

      // 取得聊天室好友詳細資料
      const { data: friend } = await getUserDetail({
        userId: friendId || "",
      });

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
          user1Deleted: chatRoomDetail?.user1Deleted,
          user1DeletedAt: chatRoomDetail?.user1DeletedAt,
          user2Deleted: chatRoomDetail?.user2Deleted,
          user2DeletedAt: chatRoomDetail?.user2DeletedAt,
        })
      );
    }
  };

export const selectChatRooms = (state: RootState) => state.chat.chatRooms;

export const selectCurrentChatRoomId = (state: RootState) =>
  state.chat.currentChatRoomId;

export const selectIsUserOnline = (state: RootState, userId: string) =>
  state.chat.onlineUsers.includes(userId);

export const selectUserOnline = (state: RootState) => state.chat.onlineUsers;

export const selectMessages = ({
  state,
  chatRoomId,
}: {
  state: RootState;
  chatRoomId: string;
}) => state.chat.messages[chatRoomId];

export default chatSlice.reducer;
