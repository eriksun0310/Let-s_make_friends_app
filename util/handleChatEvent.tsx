import { supabase } from "./supabaseClient";
import { ChatRoom, LastMessage, Message, Result } from "../shared/types";
import {
  transformChatRoom,
  transformMessage,
  transformMessages,
} from "../shared/chat/chatUtils";
import { getUserDetail, getUsersDetail } from "./handleUserEvent";
import { ChatRoomsDBType } from "../shared/dbType";

/*
處理 聊天室 db 操作
chat_rooms: 聊天室
messages: 聊天室中的訊息
*/

type GetAllChatRoomsReturn = Result & {
  data: ChatRoom[];
};

//☑️ 取得所有聊天室
export const getAllChatRooms = async ({
  userId,
}: {
  userId: string;
}): Promise<GetAllChatRoomsReturn> => {
  try {
    // 1.查詢所有聊天室
    const { data: chatRoomsData, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
      console.log("取得聊天室 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    //2. 過濾掉需要的聊天室 (過濾掉 user1_deleted 或 user2_deleted 為 true 的聊天室)
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

    // 3. 收集所有需要查詢的friendId
    const friendIds = filteredRooms.map((room) =>
      room.user1_id === userId ? room.user2_id : room.user1_id
    );

    // 4. 批量查詢所有friend的詳細資訊
    const {
      data: friendsData,
      success,
      errorMessage,
    } = await getUsersDetail({ userIds: friendIds });

    if (!success) {
      console.log("批量查詢好友資料失敗 失敗", errorMessage);
      return {
        success: false,
        errorMessage: errorMessage,
        data: [],
      };
    }

    // 5. 建立 friendId -> friend 資料的映射
    const friendMap = new Map(
      friendsData.map((friend) => [friend.userId, friend])
    );

    // 3-1. 收集所有需要查詢的聊天室Id
    const chatRoomIds = filteredRooms.map((room) => room.id);

    // 4-1. 批量查詢每個聊天室中的最後一條訊息
    const { data: lastMessages } = await getLastMessage({
      chatRoomIds: chatRoomIds,
    });

    // 5-1. 建立 chatRoomId -> lastMessage 資料的映射
    const lastMessageMap = new Map(
      lastMessages?.map((message) => [message.chat_room_id, message])
    );

    // 6. 建立每個聊天室的詳細資訊, 查詢每個聊天室中的最後一條訊息
    const chatRoomsDetails = filteredRooms.map((room) => {
      const isUser1 = room.user1_id === userId;
      const friendId = isUser1 ? room.user2_id : room.user1_id;

      const friend = friendMap.get(friendId) ?? null;
      const lastMessage = lastMessageMap.get(room.id) ?? null;
      const transformedChatRoom = transformChatRoom({
        data: room,
        options: {
          friend,
          lastMessage: lastMessage,
        },
      });

      return transformedChatRoom;
    });

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

type GetChatRoomDetailReturn = Result & {
  data: ChatRoom | null;
};
// ☑️取得聊天室的詳細資訊(根據 chatRoomId、 userId+ friendId 查詢)
export const getChatRoomDetail = async ({
  chatRoomId,
  userId,
  friendId,
}: {
  chatRoomId?: string;
  userId?: string;
  friendId?: string;
}): Promise<GetChatRoomDetailReturn> => {
  try {
    let chatRoom: ChatRoomsDBType; // 用於儲存查詢結果

    if (chatRoomId) {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", chatRoomId)
        .single();

      if (error) {
        console.log("查詢聊天室失敗", error);
        return {
          success: false,
          errorMessage: error.message,
          data: null,
        };
      }

      chatRoom = data;
    } else {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .or(
          `and(user1_id.eq.${userId},user2_id.eq.${friendId}),` +
            `and(user1_id.eq.${friendId},user2_id.eq.${userId})`
        );

      if (error) {
        console.log("查詢聊天室失敗", error);
        return {
          success: false,
          errorMessage: error.message,
          data: null,
        };
      }

      if (!data || data.length === 0) {
        // 找不到聊天室時回傳空物件
        return {
          success: true,
          data: null,
        };
      }

      chatRoom = data[0];
    }

    const transformedChatRoom = transformChatRoom({
      data: chatRoom,
    });
    return {
      success: true,
      data: transformedChatRoom,
    };
  } catch (error) {
    console.log("查詢聊天室失敗", error);

    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};
type GetLastMessageReturn = Result & {
  data: LastMessage[];
};

// ☑️取得最後一則訊息
export const getLastMessage = async ({
  chatRoomIds,
}: {
  chatRoomIds: string[];
}): Promise<GetLastMessageReturn> => {
  try {
    const { data, error } = await supabase.rpc("get_last_messages", {
      chat_room_ids: chatRoomIds,
    });

    if (error) {
      console.log("取得聊天室最後一則訊息 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    //如果data 是空數組, 返回null
    if (!data || data.length === 0) {
      console.log("聊天室沒有最後一則訊息");
      return {
        success: true,
        data: [],
      };
    }

    // 返回第一條訊息
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.log("批量查詢最後一則訊息 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

type CreateNewChatRoomAndInsertMessageReturn = Result & {
  data: {
    chatRoom: ChatRoom | null;
    messageResult: Message | null;
  };
};

//☑️ 建立新聊天室&插入訊息
export const createNewChatRoomAndInsertMessage = async ({
  userId,
  friendId,
  message,
}: {
  userId: string;
  friendId: string;
  message: string;
}): Promise<CreateNewChatRoomAndInsertMessageReturn> => {
  try {
    // 建立新聊天室
    const { data: room, error } = await supabase
      .from("chat_rooms")
      .insert({
        user1_id: userId,
        user2_id: friendId,
      })
      .select("*")
      .single();
    if (error) {
      console.log("建立新聊天室 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: {
          chatRoom: null,
          messageResult: null,
        },
      };
    }

    // 發送訊息
    const { data: messageResult, errorMessage: messageError } =
      await sendMessage({
        userId: userId,
        friendId: friendId,
        message: message,
        chatRoomId: room.id,
      });

    // 如果發送訊息失敗
    if (messageError) {
      console.log("建立新訊息 失敗", messageError);
      return {
        success: false,
        errorMessage: messageError,
        data: {
          chatRoom: null,
          messageResult: null,
        },
      };
    }

    // 取得聊天室好友資料
    const { data: friend } = await getUserDetail({
      userId: friendId,
    });
    // 取得聊天室最後一則訊息
    const { data: lastMessage } = await getLastMessage({
      chatRoomIds: [room.id],
    });

    const transformedChatRoom = transformChatRoom({
      data: room,
      options: {
        friend: friend,
        lastMessage: lastMessage[0],
      },
    });
    return {
      success: true,
      data: {
        chatRoom: transformedChatRoom,
        messageResult: messageResult,
      },
    };
  } catch (error) {
    console.log("建立新聊天室 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: {
        chatRoom: null,
        messageResult: null,
      },
    };
  }
};

type GetMessagesReturn = Result & {
  data: Message[];
};
// ☑️取得聊天室訊息
export const getMessages = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<GetMessagesReturn> => {
  try {
    if (!chatRoomId) {
      console.log("與該好友尚未傳遞訊息");
      return {
        success: true,
        data: [],
      };
    }

    // 取得聊天室資料
    const { data: chatRoom, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .select("*")
      .eq("id", chatRoomId)
      .single();

    if (chatRoomError) {
      console.log("取得聊天室資料 失敗", chatRoomError);
      return {
        success: false,
        errorMessage: chatRoomError.message,
        data: [],
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
      console.log("取得聊天室訊息 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: transformMessages(data),
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

type SendMessageReturn = Result & {
  data: Message | null;
};

// ☑️發送訊息
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
}): Promise<SendMessageReturn> => {
  try {
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
      console.log("建立新訊息 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data: transformMessage(messageData),
    };
  } catch (error) {
    console.log("建立新訊息 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

// ☑️ new - 更新 聊天室 未讀數量 +1 改用 Postgres function
export const updateUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<Result> => {
  try {
    const { error } = await supabase.rpc("increment_unread_count", {
      chat_room_id: chatRoomId,
      user_id: userId,
    });

    if (error) {
      console.log("更新 聊天室未讀數量 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️更新 聊天室 未讀數為0
export const resetUnreadCount = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<Result> => {
  try {
    // 獲取聊天室資料
    const { data: updatedRoom, error } = await supabase
      .from("chat_rooms")
      .update((room: ChatRoomsDBType) => {
        const unreadColumn =
          room.user1_id === userId
            ? "unread_count_user1"
            : room.user2_id === userId
            ? "unread_count_user2"
            : null;

        if (!unreadColumn) return null;

        return {
          [unreadColumn]: 0,
        };
      })
      .eq("id", chatRoomId)
      .select("user1_id, user2_id, unread_count_user1, unread_count_user2")
      .single();

    if (error || !updatedRoom) {
      console.log("更新聊天室未讀數量 失敗", error);
      return {
        success: false,
        errorMessage: error?.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新聊天室未讀數量為0 失敗:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️單條訊息的更新已讀
export const markMessageAsRead = async (messageId: string): Promise<Result> => {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) {
      console.log("更新訊息為已讀 失敗:", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新訊息為已讀 失敗:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️將自己相關的未讀訊息標記為已讀
export const markChatRoomMessagesAsRead = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<Result> => {
  try {
    // 確定當前用戶是 user1 或 user2
    const { data: updatedChatRoom, error: updatedChatRoomError } =
      await supabase
        .from("chat_rooms")
        .update((room: ChatRoomsDBType) => {
          const unreadColumn =
            room.user1_id === userId
              ? "unread_count_user1"
              : "unread_count_user2";
          return {
            [unreadColumn]: 0,
          };
        })
        .eq("id", chatRoomId)
        .select("*")
        .single(); // 返回更新後的聊天室

    if (updatedChatRoomError || !updatedChatRoom) {
      console.log("更新聊天室未讀數量 失敗", updatedChatRoomError);
      return {
        success: false,
        errorMessage: updatedChatRoomError?.message,
      };
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
      console.log("更新訊息為已讀 失敗", updateMessageError);
      return {
        success: false,
        errorMessage: updateMessageError.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("將自己相關的未讀訊息標記為已讀 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

//🈲 目前還沒用到: 標記整個聊天室的消息為已讀(for: 發送訊息的那方, 會先 提醒 --以下為查看訊息-- , 在更新對方的已讀, 主要讓發送者知道 對方有哪一則訊息是沒有讀到的)
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
      console.log("Error updating messages:", updateMessageError);
      return false;
    }

    return true;
  } catch (error) {
    console.log("Unexpected error:", error);
    return false;
  }
};

// 取得刪除聊天室對應的欄位
const getDeleteColumns = ({
  room,
  userId,
}: {
  room: ChatRoomsDBType;
  userId: string;
}) => {
  const deletedColumn =
    room.user1_id === userId ? "user1_deleted" : "user2_deleted";
  const deletedAtColumn =
    room.user1_id === userId ? "user1_deleted_at" : "user2_deleted_at";
  const unreadColumn =
    room.user1_id === userId ? "user1_deleted_at" : "user2_deleted_at";

  if (!deletedColumn) {
    throw new Error("沒有權限刪除聊天室");
  }

  return {
    deletedColumn,
    deletedAtColumn,
    unreadColumn,
  };
};

type DeleteChatRoomDBReturn = Result & {
  data: string;
};

// ☑️刪除聊天室
export const deleteChatRoomDB = async ({
  chatRoomId,
  userId,
}: {
  chatRoomId: string;
  userId: string;
}): Promise<DeleteChatRoomDBReturn> => {
  try {
    // 更新聊天室對應的欄位 + 取得更新後的聊天室資料
    const { data: updatedChatRoom, error } = await supabase
      .from("chat_rooms")
      .update((room: ChatRoomsDBType) => {
        const { deletedColumn, deletedAtColumn, unreadColumn } =
          getDeleteColumns({
            room,
            userId,
          });
        return {
          ...room,
          [deletedColumn]: true,
          [deletedAtColumn]: new Date().toISOString(),
          [unreadColumn]: 0,
        };
      })
      .eq("id", chatRoomId)
      .select("*")
      .single();

    if (error || !updatedChatRoom) {
      console.log("更新或查詢聊天室 失敗", error);
      return {
        success: false,
        errorMessage: error?.message,
        data: "",
      };
    }

    // 如果雙方都已刪除, 執行訊息刪除
    if (updatedChatRoom.user1_deleted && updatedChatRoom.user2_deleted) {
      const { success, errorMessage } = await deleteChatMessage({
        chatRoomId,
      });
      if (!success) {
        console.log("刪除聊天室 訊息 失敗:", errorMessage);
        return {
          success: false,
          errorMessage: errorMessage,
          data: "",
        };
      }
    }

    return {
      success: true,
      data: updatedChatRoom.id,
    };
  } catch (error) {
    console.log("刪除聊天室 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: "",
    };
  }
};

// ☑️刪除聊天紀錄
export const deleteChatMessage = async ({
  chatRoomId,
}: {
  chatRoomId: string;
}): Promise<Result> => {
  try {
    // 刪除聊天室中的所有訊息
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("chat_room_id", chatRoomId);

    if (error) {
      console.log("Error deleting messages:", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("刪除聊天紀錄 error:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type DeletedColumn = "user1Deleted" | "user2Deleted";
//☑️ 還原刪除的聊天室(ex: A刪除了聊天室, 但是B又傳訊息了, A點進聊天室, 把A刪除的聊天室還原)
export const resetDeleteChatRoomDB = async ({
  chatRoomId,
  deletedColumn,
}: {
  chatRoomId: string;
  deletedColumn: DeletedColumn;
}): Promise<Result> => {
  try {
    const updateDeletedColumn =
      deletedColumn === "user1Deleted" ? "user1_deleted" : "user2_deleted";

    const { error } = await supabase
      .from("chat_rooms")
      .update({
        [updateDeletedColumn]: false,
      })
      .eq("id", chatRoomId);

    if (error) {
      console.log("更新重置刪除聊天室 error:", error);
      return {
        success: false,
        errorMessage: (error as Error).message,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.log("重置刪除聊天室 error:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};
