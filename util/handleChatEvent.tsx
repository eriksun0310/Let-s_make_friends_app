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
        lastTime: formatTimeWithDayjs(lastMessageData?.created_at),
        lastMessage: lastMessageData?.content,
        id: room.id,
        created_at: room.created_at,
        userId1: room.user1_id,
        userId2: room.user2_id,
        user1Deleted: room.user1_deleted,
        user2Deleted: room.user2_deleted,
        unreadCountUser1: room.unread_count_user1,
        unreadCountUser2: room.unread_count_user2,
        friend: friend,
      };
    })
  );
  console.log("chatRoomsDetails", chatRoomsDetails);
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
    .limit(1); //只取最後一條訊息

  if (error) {
    console.error("Error fetching last message:", error);
    return null;
  }

  //如果data 是空數組, 返回null
  if (!data || data.length === 0) {
    return null;
  }

  // 返回第一條訊息
  return data[0];
};

// 建立新聊天室
export const createNewChatRoom = async (userId: string, friendId: string) => {
  const { data: room, error } = await supabase
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
  console.log("createNewChatRoom room", room);

  // const isUser1 = room.user1_id === userId;
  // const friendId = isUser1 ? room.user2_id : room.user1_id;
  const friend = await getFriendDetail(friendId);
  const lastMessageData = await getLastMessage(room.id);
  return {
    id: room.id,
    created_at: room.created_at,
    userId1: room.user1_id,
    userId2: room.user2_id,
    user1Deleted: room.user1_deleted,
    user2Deleted: room.user2_deleted,
    unreadCountUser1: room.unread_count_user1,
    unreadCountUser2: room.unread_count_user2,
    friend: friend,
    lastTime: formatTimeWithDayjs(lastMessageData?.created_at),
    lastMessage: lastMessageData?.content,
  };
};

// 取得聊天室訊息
export const getMessages = async (chatRoomId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: true }); // 根據 created_at 排序，確保先發的訊息在上

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
  const { data: messageData, error: messageError } = await supabase
    .from("messages")
    .insert({
      chat_room_id: chatRoomId,
      sender_id: userId,
      recipient_id: friendId,
      content: message,
    })
    .select("*") // 插入後直接返回該條訊息
    .single(); // 確保只返回單條訊息

  if (messageError) {
    console.error("Error sending message:", messageError);
    return {
      success: false,
      error: messageError.message,
    };
  }

  //TODO:先關 應該用不到  更新 聊天室 未讀數量
  // const result = await updateUnreadCount({
  //   chatRoomId: chatRoomId,
  //   userId: userId,
  // });

  // if (result.error) {
  //   console.error("Error updating unread count:", result.error);
  //   return {
  //     success: false,
  //     error: result.error,
  //   };
  // }

  // 返回成功訊息與創建的資料，並附帶 tempId 來更新前端
  return {
    success: true,
    data: {
      ...messageData, // 後端返回的正式訊息資料
    },
  };
};

// 更新 聊天室 未讀數量 +1
export const updateUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  const { data: chatRoom } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("id", chatRoomId)
    .single();

  const unreadColumn =
    chatRoom.user1_id === userId ? "unread_count_user1" : "unread_count_user2";

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

// 更新 聊天室 未讀數量歸0
export const resetUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  try {
    // 獲取聊天室資料
    const { data: chatRoom, error } = await supabase
      .from("chat_rooms")
      .select("user1_id, user2_id, unread_count_user1, unread_count_user2")
      .eq("id", chatRoomId)
      .single();

    if (error) {
      console.error("Error fetching chat room:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // 判斷哪個用戶的未讀數量要歸0
    let unreadColumn = "";
    if (chatRoom.user1_id === userId) {
      unreadColumn = "unread_count_user1";
    } else if (chatRoom.user2_id === userId) {
      unreadColumn = "unread_count_user2";
    }

    // 如果找到了對應的用戶,將未讀數量歸0
    if (unreadColumn) {
      const { error: updateError } = await supabase
        .from("chat_rooms")
        .update({ [unreadColumn]: 0 })
        .eq("id", chatRoomId);

      if (updateError) {
        console.error("Error resetting unread count:", updateError);
        return {
          success: false,
          error: updateError.message,
        };
      }

      return {
        success: true,
      };
    } else {
      console.error("Error resetting unread count: No matching user found");
      return {
        success: false,
        error: "No matching user found",
      };
    }
  } catch (error) {
    console.error("Error resetting unread count:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 單條訊息的更新已讀
export const markMessageAsRead = async (messageId) => {
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", messageId);

  if (error) {
    console.error("Failed to mark message as read:", error);
    return false;
  }

  return true;
};

// TODO: 到時候用不到刪掉
// // 標記整個聊天室的消息為已讀
// export const markChatRoomMessagesAsRead = async ({ chatRoomId, userId }) => {
//   //console.log("chatRoomId:", chatRoomId, "userId:", userId);

//   const { error } = await supabase
//     .from("messages")
//     .update({ is_read: true })
//     .eq("chat_room_id", chatRoomId)
//     .eq("recipient_id", userId); // 僅標記該用戶接收的訊息為已讀

//   if (error) {
//     console.error("Failed to mark messages as read:", error);
//     return false;
//   }

//   // console.log("Messages in chat room marked as read:", chatRoomId);
//   return true;
// };

export const markChatRoomMessagesAsRead = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  try {
    // 確定當前用戶是 user1 或 user2
    const { data: chatRoom, error: roomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", chatRoomId)
      .single();

    if (roomError || !chatRoom) {
      console.error("Error fetching chat room:", roomError);
      return false;
    }

    const unreadColumn =
      chatRoom.user1_id === userId
        ? "unread_count_user1"
        : "unread_count_user2";

    // 更新聊未讀數量為0
    const { error: updateError } = await supabase
      .from("chat_rooms")
      .update({ [unreadColumn]: 0 })
      .eq("id", chatRoomId);

    if (updateError) {
      console.error("Error updating unread count:", updateError);
      return false;
    }

    // 將該聊天室中屬於當前用戶的訊息標記為已讀
    const { error: updateMessageError } = await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("chat_room_id", chatRoomId)
      .eq("recipient_id", userId); // 僅更新屬於當前用戶的訊息

    if (updateMessageError) {
      console.error("Error updating messages:", updateMessageError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};

// 刪除聊天室
export const deleteChatRoom = async (roomId: string) => {};

// 刪除聊天紀錄
export const deleteChatHistory = async (roomId: string) => {};
