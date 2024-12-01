import { supabase } from "./supabaseClient";
import { addChatRoom } from "../store/chatSlice";
import { UnknownAction } from "@reduxjs/toolkit";
import { getFriendDetail } from "./handleFriendsEvent";
import { formatTimeWithDayjs } from "../shared/funcs";

// 處理 聊天室 db 操作(chat_rooms、messages)

// 取得所有聊天室
export const getAllChatRooms = async (userId: string) => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching chat rooms:", error);
    return [];
  }

  // 取得每個聊天室的詳細資訊
  const chatRoomsDetails = await Promise.all(
    data.map(async (room) => {
      const isUser1 = room.user1_id === userId;
      const friendId = isUser1 ? room.user2_id : room.user1_id;
      const friend = await getFriendDetail(friendId);
      const lastMessageData = await getLastMessage(room.id);

      return {
        ...room,
        last_time: formatTimeWithDayjs(lastMessageData?.created_at),
        last_message: lastMessageData?.content,
        unread_count: isUser1
          ? room.unread_count_user1
          : room.unread_count_user2,
        friend: {
          ...friend,
        },
      };
    })
  );

  return chatRoomsDetails;
};

// 取得與好友的聊天室
export const getChatRoom = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}) => {
  const { data, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(
      `and(user1_id.eq.${userId},user2_id.eq.${friendId}),` +
        `and(user1_id.eq.${friendId},user2_id.eq.${userId})`
    );

  if (error) {
    console.error("Error fetching chat room:", error);
    return {
      id: null,
    };
  }

  // 如果找不到聊天室
  if (!data || data.length === 0) {
    return {
      id: null,
    };
  }
  // 假設只有一個聊天室
  return data[0];
};

// 取得最後一則訊息
export const getLastMessage = async (chatRoomId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("content, created_at")
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: false }) // 按照時間降序排列
    .limit(1) //只取最後一條訊息
    .single(); // 獲取單條記錄

  if (error) {
    console.error("Error fetching last message:", error);
    return null;
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
    return {};
  }
  return data;
};

// 取得聊天室訊息
export const getMessages = async (chatRoomId: string) => {

  console.log('chatRoomId', chatRoomId)
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true }); // 不確定要幹嘛的

  if (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data: data,
  };
};

// 發送訊息
export const sendMessage = async ({
  userId,
  friendId,
  message,
  chatRoomId,
}: {
  userId: string;
  friendId: string;
  message: string;
  chatRoomId: string;
}) => {
  // 發送訊息
  const { error: messageError } = await supabase.from("messages").insert({
    chat_room_id: chatRoomId,
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

  // 更新 聊天室 未讀數量
  const result = await updateUnreadCount({
    chatRoomId: chatRoomId,
    userId: userId,
  });



  if (result.error) {
    console.error("Error updating unread count:", result.error);
    return {
      success: false,
      error: result.error,
    };
  }
  // 更新未讀數量
  // const unreadField =
  //   userId === chatRoomId.user1_id
  //     ? "unread_count_user2"
  //     : "unread_count_user1";

  // const { error: updateError } = await supabase
  //   .from("chat_rooms")
  //   .update({ [unreadField]: supabase.raw(`${unreadField} + 1`) })
  //   .eq("id", chatRoomId);

  // if (updateError) {
  //   throw new Error(`Failed to update unread count: ${updateError.message}`);
  // }

  return { success: true };

  // return {
  //   success: true,
  //   chatRoom: chatRoom,
  // };
};

// 更新 聊天室 未讀數量
export const updateUnreadCount = async ({ chatRoomId, userId }) => {
  const { data: chatRoom } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("id", chatRoomId)
    .single();

  const unreadColumn =
    chatRoom.user1_id === userId ? "unread_count_user2" : "unread_count_user1";

  const { error } = await supabase
    .from("chat_rooms")
    .update({ [unreadColumn]: chatRoom[unreadColumn] + 1 })
    .eq("id", chatRoom.id);

  if (error) {
    console.error("Error updating unread count:", error);
    return {
      success: false,
      error: error.message,
    };
  }
  return {
    success: true,
  };
};

// 刪除聊天室
export const deleteChatRoom = async (roomId: string) => {};

// 刪除聊天紀錄
export const deleteChatHistory = async (roomId: string) => {};
