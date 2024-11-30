import { supabase } from "./supabaseClient";
import { addChatRoom } from "../store/chatSlice";
import { UnknownAction } from "@reduxjs/toolkit";

// 處理 聊天室 db 操作(chat_rooms、messages)

// 取得所有聊天室
export const getChatRooms = async (userId: string) => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching chat rooms:", error);
    return [];
  }

  return data;
};

// 建立新聊天室
export const createNewChatRoom = async (userId: string, friendId: string) => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({
      user1_id: userId,
      user2_id: friendId,
    })
    .select("*")
    .single();
  if (error) {
    console.error("Error creating chat room:", error);
    return null;
  }

  console.log("新聊天室", data);
  return data;
};

// 取得聊天室訊息
export const getMessages = async (chatRoomId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true }); // 不確定要幹嘛的

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
};

// 發送訊息
export const sendMessage = async ({
  userId,
  friendId,
  message,
  chatRooms, // 從redux 中取得聊天室列表
  dispatch,
}: {
  userId: string;
  friendId: string;
  message: string;
  chatRooms: any[];
  dispatch: React.Dispatch<UnknownAction>;
}) => {
  // 檢查是否已存在聊天室
  let chatRoom = chatRooms.find(
    (room) =>
      (room.user1_id === userId && room.user2_id === friendId) ||
      (room.user1_id === friendId && room.user2_id === userId)
  );

  // 如果不存在聊天室，則建立新聊天室
  if (!chatRoom) {
    chatRoom = await createNewChatRoom(userId, friendId);
    if (chatRoom) {
      dispatch(addChatRoom(chatRoom));
    } else {
      console.error("Error creating chat room");
    }
  }

  // 發送訊息
  const { error: messageError } = await supabase.from("messages").insert({
    chat_room_id: chatRoom.id,
    sender_id: userId,
    recipient_id: friendId,
    content: message,
  });

  if (messageError) {
    console.error("Error sending message:", messageError);
    return {
      success: false,
      error: messageError.message,
    };
  }

  return {
    success: true,
    chatRoom: chatRoom,
  };
};

// 刪除聊天室
export const deleteChatRoom = async (roomId: string) => {};

// 刪除聊天紀錄
export const deleteChatHistory = async (roomId: string) => {};
