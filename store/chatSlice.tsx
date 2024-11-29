import { createSlice } from "@reduxjs/toolkit";

interface InitialStateProps {
  chatRooms: [];
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
  },
});

export const { setChatRooms, addChatRoom } = chatSlice.actions;

export const selectChatRooms = (state: any) => state.chat;

export default chatSlice.reducer;
