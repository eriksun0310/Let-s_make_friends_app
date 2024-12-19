import { supabase } from "./supabaseClient";
import { addChatRoom } from "../store/chatSlice";
import { UnknownAction } from "@reduxjs/toolkit";
import { getFriendDetail } from "./handleFriendsEvent";
import { formatTimeWithDayjs } from "../shared/funcs";

// 處理 聊天室 db 操作(chat_rooms、messages)

// 取得所有聊天室
export const getAllChatRooms = async (userId: string) => {
  const { data: chatRoomsData, error } = await supabase
    .from("chat_rooms")
    .select("*")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) {
    console.error("Error fetching chat rooms:", error);
    return [];
  }

  //過濾掉 user1_deleted 或 user2_deleted 為 true 的聊天室
  const filteredRooms = chatRoomsData.filter((room) => {
    // user1_deleted:true &&
    // 如果 a 刪除聊天室，但 b 沒有刪除，則 b 可以看到聊天室
    if (
      room.user1_id === userId &&
      room.user1_deleted &&
      room.unread_count_user1 === 0
    )
      return false;
    if (
      room.user2_id === userId &&
      room.user2_deleted &&
      room.unread_count_user2 === 0
    )
      return false;

    // 其他情況下顯示聊天室
    return true;
  });

  // 取得每個聊天室的詳細資訊
  const chatRoomsDetails = await Promise.all(
    filteredRooms.map(async (room) => {
      const isUser1 = room.user1_id === userId;
      const friendId = isUser1 ? room.user2_id : room.user1_id;
      const friend = await getFriendDetail(friendId);
      const lastMessageData = await getLastMessage(room.id);

      return {
        lastTime: formatTimeWithDayjs(lastMessageData?.created_at),
        lastMessage: lastMessageData?.content,
        id: room.id,
        created_at: room.created_at,
        user1Id: room.user1_id,
        user2Id: room.user2_id,
        user1Deleted: room.user1_deleted,
        user2Deleted: room.user2_deleted,
        unreadCountUser1: room.unread_count_user1,
        unreadCountUser2: room.unread_count_user2,
        lastMessageTime: lastMessageData?.created_at, // 添加最新訊息的時間，用於排序
        friend: friend,
      };
    })
  );

  //console.log("chatRoomsDetails", chatRoomsDetails);

  // 根據最後一條訊息的時間進行排序,將最新的聊天室排到最上面
  const sortedChatRooms = chatRoomsDetails.sort((a, b) => {
    if (a.lastMessageTime && b.lastMessageTime) {
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    }
    return 0; // 若有空值則保持原順序
  });

  return sortedChatRooms;
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
  // console.log('createNewChatRoom', userId, friendId);

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
  // console.log("createNewChatRoom room", room);

  // const isUser1 = room.user1_id === userId;
  // const friendId = isUser1 ? room.user2_id : room.user1_id;
  const friend = await getFriendDetail(friendId);
  const lastMessageData = await getLastMessage(room.id);
  return {
    id: room.id,
    created_at: room.created_at,
    user1Id: room.user1_id,
    user2Id: room.user2_id,
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
export const getMessages = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  if (!chatRoomId) {
    console.log("與該好友尚未傳遞訊息");
    return {
      success: false,
      error: "與該好友尚未傳遞訊息",
    };
  }

  // 取得聊天室資料
  const { data: chatRoom, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select("*")
    .eq("id", chatRoomId)
    .single();

  if (chatRoomError) {
    console.error("Error fetching chat room:", chatRoomError);
    return {
      success: false,
      error: chatRoomError.message,
    };
  }

  // 確定當前使用者的刪除時間
  const deletedAt =
    chatRoom.user1_id === userId
      ? chatRoom.user1_deleted_at
      : chatRoom.user2_deleted_at;

  //如果刪除時間為空, 表示使用者未刪除聊天室
  const filterTime = deletedAt || "1970-01-01T00:00:00Z";

  // 查詢過濾後的訊息
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_room_id", chatRoomId)
    .gte("created_at", filterTime) // 過濾刪除時間之前的訊息
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

// origin - 更新 聊天室 未讀數量 +1
// export const updateUnreadCount = async ({
//   chatRoomId,
//   userId,
// }: {
//   chatRoomId: string;
//   userId: string;
// }) => {
//   const { data: chatRoom } = await supabase
//     .from("chat_rooms")
//     .select("*")
//     .eq("id", chatRoomId)
//     .single();

//   const unreadColumn =
//     chatRoom.user1_id === userId ? "unread_count_user1" : "unread_count_user2";

//   const { error } = await supabase
//     .from("chat_rooms")
//     .update({ [unreadColumn]: chatRoom[unreadColumn] + 1 })
//     .eq("id", chatRoom.id);

//   if (error) {
//     console.error("Error updating unread count:", error);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
//   return {
//     success: true,
//   };
// };

//  new - 更新 聊天室 未讀數量 +1 改用 Postgres function
export const updateUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  const { error } = await supabase.rpc("increment_unread_count", {
    chat_room_id: chatRoomId,
    user_id: userId,
  });

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

    // 確定使用者刪除時間
    const userDeletedAt =
      chatRoom.user1_id === userId
        ? chatRoom.user1_deleted_at
        : chatRoom.user2_deleted_at;

    // 如果聊天室已刪除且刪除時間不為空，不標記已讀
    if (userDeletedAt) {
      console.log(
        "User has deleted the chat room. Skipping mark as read operation."
      );
      return true; // 視為成功，但不標記已讀 (跳過更新未讀數量和訊息的已讀狀態。)
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
export const deleteChatRoomDB = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    // 查詢聊天室資料
    const { data: chatRoom, error: fetchError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (fetchError || !chatRoom) {
      console.error("Chat room not found or fetch error:", fetchError);
      return {
        success: false,
        error: "Chat room not found",
      };
    }

    // 判斷是哪個用戶刪除聊天室
    let deletedColumn = "";
    let deletedAtColumn = "";
    let unreadColumn = "";
    if (chatRoom.user1_id === userId) {
      deletedColumn = "user1_deleted";
      deletedAtColumn = "user1_deleted_at";
      unreadColumn = "unread_count_user1";
    } else if (chatRoom.user2_id === userId) {
      deletedColumn = "user2_deleted";
      deletedAtColumn = "user2_deleted_at";
      unreadColumn = "unread_count_user2";
    } else {
      console.error("User ID does not match chat room participants");
      return {
        success: false,
        error: "Unauthorized action",
      };
    }

    console.log("deletedColumn", deletedColumn, "unreadColumn", unreadColumn);

    // 更新刪除狀態及未讀數量
    const { error: updateError } = await supabase
      .from("chat_rooms")
      .update({
        [deletedColumn]: true,
        [deletedAtColumn]: new Date().toISOString(),
        [unreadColumn]: 0,
      })
      .eq("id", roomId);

    if (updateError) {
      console.error(
        "Error update chat room  deletedColumn unreadColumn :",
        updateError
      );
      return {
        success: false,
        error: updateError.message,
      };
    }

    // 再次查詢已確認刪除條件
    const { data: updatedChatRoom, error: reFetchError } = await supabase
      .from("chat_rooms")
      .select("id, user1_deleted, user2_deleted")
      .eq("id", roomId)
      .single();

    if (reFetchError || !updatedChatRoom) {
      console.error("Failed to re-fetch updated chat room:", reFetchError);
      return {
        success: false,
        error: "Chat room not found",
      };
    }

    // 如果 user1_deleted && user2_deleted 都為 true，則刪除 messages 的資料
    if (updatedChatRoom.user1_deleted && updatedChatRoom.user2_deleted) {
      const deleteResult = await deleteChatMessage(roomId);
      if (!deleteResult.success) {
        console.error("Failed to delete messages:", deleteResult.error);
        return {
          success: false,
          error: deleteResult.error,
        };
      }
    }

    return {
      success: true,
      roomId: updatedChatRoom.id,
    };
  } catch (error) {
    console.error("刪除聊天室 error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 刪除聊天紀錄
export const deleteChatMessage = async (roomId: string) => {
  try {
    // 刪除聊天室中的所有訊息
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("chat_room_id", roomId);

    if (error) {
      console.error("Error deleting messages:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("刪除聊天紀錄 error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
