import { supabase } from "./supabaseClient";
import { ChatRoom, Message, Result } from "../shared/types";
import {
  transformChatRoom,
  transformMessage,
  transformMessages,
} from "../shared/chat/chatUtils";
import { getUserDetail } from "./handleUserEvent";

/*
處理 聊天室 db 操作
chat_rooms: 聊天室
messages: 聊天室中的訊息
*/

type GetAllChatRoomsReturn = Result & {
  data: ChatRoom[];
};

// 取得所有聊天室
export const getAllChatRooms = async ({
  userId,
}: {
  userId: string;
}): Promise<GetAllChatRoomsReturn> => {
  try {
    const { data: chatRoomsData, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
      console.error("取得聊天室 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
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

    // 取得每個聊天室的詳細資料
    const chatRoomsDetails = await Promise.all(
      filteredRooms.map(async (room) => {
        const isUser1 = room.user1_id === userId;
        const friendId = isUser1 ? room.user2_id : room.user1_id;

        const { data: friend } = await getUserDetail({
          userId: friendId,
        });

        const lastMessageData = await getLastMessage(room.id);

        return {
          id: room.id,
          createdAt: room.created_at,
          user1Id: room.user1_id,
          user2Id: room.user2_id,
          user1Deleted: room.user1_deleted,
          user2Deleted: room.user2_deleted,
          user1DeletedAt: room.user1_deleted_at,
          user2DeletedAt: room.user2_deleted_at,
          unreadCountUser1: room.unread_count_user1,
          unreadCountUser2: room.unread_count_user2,
          friend: friend,
          lastTime: lastMessageData?.created_at!,
          lastMessage: lastMessageData?.content!,
        };
      })
    );

    //console.log("chatRoomsDetails", chatRoomsDetails);

    // 根據最後一條訊息的時間進行排序,將最新的聊天室排到最上面
    const sortedChatRooms = chatRoomsDetails.sort((a, b) => {
      if (a.lastTime && b.lastTime) {
        return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime();
      }
      return 0; // 若有空值則保持原順序
    }) as ChatRoom[];

    return {
      success: true,
      data: sortedChatRooms,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

// 取得聊天室的詳細資訊(根據 chatRoomId、 userId+ friendId 查詢)
export const getChatRoomDetail = async ({
  chatRoomId,
  userId,
  friendId,
}: {
  chatRoomId?: string;
  userId?: string;
  friendId?: string;
}): Promise<ChatRoom> => {
  try {
    let data: any = null; // 用於儲存查詢結果

    if (chatRoomId) {
      const result = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", chatRoomId)
        .single();

      if (result.error) {
        console.error("Error fetching chat room details:", result.error);
        return {} as ChatRoom;
      }

      data = result.data;
    } else {
      const result = await supabase
        .from("chat_rooms")
        .select("*")
        .or(
          `and(user1_id.eq.${userId},user2_id.eq.${friendId}),` +
            `and(user1_id.eq.${friendId},user2_id.eq.${userId})`
        );

      if (result.error) {
        console.error("Error fetching chat room details:", result.error);
      }
      if (!result.data || result.data.length === 0) {
        // 找不到聊天室時回傳空物件
        return {} as ChatRoom;
      }

      data = result.data[0];
    }

    return transformChatRoom({
      data: data,
    });
  } catch (error) {
    console.log("Error fetching chat room details:", error);

    return {} as ChatRoom;
  }
};

// 取得最後一則訊息
export const getLastMessage = async (
  chatRoomId: string
): Promise<{
  content: string;
  created_at: Date;
} | null> => {
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

// 建立新聊天室&插入訊息
export const createNewChatRoomAndInsertMessage = async ({
  userId,
  friendId,
  message,
}: {
  userId: string;
  friendId: string;
  message: string;
}): Promise<{
  chatRoom: ChatRoom;
  messageResult: Message;
}> => {
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
    return {} as {
      chatRoom: ChatRoom;
      messageResult: Message;
    };
  }

  // 發送訊息
  const messageResult = await sendMessage({
    userId: userId,
    friendId: friendId,
    message: message,
    chatRoomId: room.id,
  });

  // 如果發送訊息失敗
  if (messageResult.error) {
    console.error("Error sending message:", messageResult.error);
    throw new Error("Failed to send message");
  }

  const { data: friend } = await getUserDetail({
    userId: friendId,
  });
  const lastMessageData = await getLastMessage(room.id);
  console.log(" 建立新聊天室 lastMessageData", lastMessageData);

  const transformedChatRoom = transformChatRoom({
    data: room,
    options: {
      friend: friend,
      lastMessageData: lastMessageData as { created_at: Date; content: string },
    },
  });
  return {
    chatRoom: transformedChatRoom,
    messageResult: messageResult.data!,
  };
};

// 取得聊天室訊息
export const getMessages = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: Message[];
}> => {
  if (!chatRoomId) {
    console.log("與該好友尚未傳遞訊息");
    return {
      success: false,
      errorMessage: "與該好友尚未傳遞訊息",
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
      errorMessage: chatRoomError.message,
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
      errorMessage: error.message,
    };
  }

  return {
    success: true,
    data: transformMessages(data),
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
}): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: Message;
}> => {
  // 發送訊息
  const { data: messageData, error } = await supabase
    .from("messages")
    .insert({
      chat_room_id: chatRoomId,
      sender_id: userId,
      recipient_id: friendId,
      content: message,
    })
    .select("*") // 插入後直接返回該條訊息
    .single(); // 確保只返回單條訊息

  if (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      errorMessage: error.message,
    };
  }

  return {
    success: true,
    data: transformMessage(messageData),
  };
};

//  new - 更新 聊天室 未讀數量 +1 改用 Postgres function
export const updateUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<Result> => {
  const { error } = await supabase.rpc("increment_unread_count", {
    chat_room_id: chatRoomId,
    user_id: userId,
  });

  if (error) {
    console.error("Error updating unread count:", error);

    return {
      success: false,
      errorMessage: error.message,
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
}): Promise<Result> => {
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
        errorMessage: error.message,
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
          errorMessage: updateError.message,
        };
      }

      return {
        success: true,
      };
    } else {
      console.error("Error resetting unread count: No matching user found");
      return {
        success: false,
        errorMessage: "No matching user found",
      };
    }
  } catch (error) {
    console.error("Error resetting unread count:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// 單條訊息的更新已讀
export const markMessageAsRead = async (
  messageId: string
): Promise<boolean> => {
  console.log(" markMessageAsRead messageId", messageId);
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

//將自己相關的未讀訊息標記為已讀
export const markChatRoomMessagesAsRead = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<boolean> => {
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

// 目前還沒用到: 標記整個聊天室的消息為已讀(for: 發送訊息的那方, 會先 提醒 --以下為查看訊息-- , 在更新對方的已讀, 主要讓發送者知道 對方有哪一則訊息是沒有讀到的)
export const markChatRoomMessagesAllAsRead = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<boolean> => {
  try {
    // 將該聊天室中屬於當前用戶的訊息標記為已讀
    const { error: updateMessageError } = await supabase
      .from("messages")
      .update({
        is_read: true,
      })
      .eq("chat_room_id", chatRoomId)
      .eq("sender_id", userId); // 僅更新屬於當前用戶的訊息

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
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
  chatRoomId?: string;
}> => {
  try {
    // 查詢聊天室資料
    const { data: chatRoom, error: fetchError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", chatRoomId)
      .single();

    if (fetchError || !chatRoom) {
      console.error("Chat room not found or fetch error:", fetchError);
      return {
        success: false,
        errorMessage: "Chat room not found",
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
        errorMessage: "Unauthorized action",
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
      .eq("id", chatRoomId);

    if (updateError) {
      console.error(
        "Error update chat room  deletedColumn unreadColumn :",
        updateError
      );
      return {
        success: false,
        errorMessage: updateError.message,
      };
    }

    // 再次查詢已確認刪除條件
    const { data: updatedChatRoom, error: reFetchError } = await supabase
      .from("chat_rooms")
      .select("id, user1_deleted, user2_deleted")
      .eq("id", chatRoomId)
      .single();

    if (reFetchError || !updatedChatRoom) {
      console.error("Failed to re-fetch updated chat room:", reFetchError);
      return {
        success: false,
        errorMessage: "Chat room not found",
      };
    }

    // 如果 user1_deleted && user2_deleted 都為 true，則刪除 messages 的資料
    if (updatedChatRoom.user1_deleted && updatedChatRoom.user2_deleted) {
      const deleteResult = await deleteChatMessage(chatRoomId);
      if (!deleteResult.success) {
        console.error("Failed to delete messages:", deleteResult.error);
        return {
          success: false,
          errorMessage: deleteResult.error,
        };
      }
    }

    return {
      success: true,
      chatRoomId: updatedChatRoom.id,
    };
  } catch (error) {
    console.error("刪除聊天室 error:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// 刪除聊天紀錄
export const deleteChatMessage = async (
  chatRoomId: string
): Promise<Result> => {
  try {
    // 刪除聊天室中的所有訊息
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("chat_room_id", chatRoomId);

    if (error) {
      console.error("Error deleting messages:", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("刪除聊天紀錄 error:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// 重置聊天室的刪除狀態
export const resetDeleteChatRoomDB = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}) => {
  try {
    const isUser1 = chatRoomId === userId;
    let deletedColumn = isUser1 ? "user1_deleted" : "user2_deleted";

    const { error } = await supabase
      .from("chat_rooms")
      .update({
        [deletedColumn]: false,
      })
      .eq("id", chatRoomId);

    if (error) {
      console.error("更新重置刪除聊天室 error:", error);
    }
  } catch (error) {
    console.error("重置刪除聊天室 error:", error);
  }
};
