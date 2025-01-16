import { ChatRoomsDBType, MessagesDBType } from "../dbType";
import { ChatRoom, LastMessage, Message, User } from "../types";

/* chatUtils.ts 專注於工具函數 */

// 轉換前端可讀聊天室資料
export const transformChatRoom = ({
  data,
  options,
}: {
  data: ChatRoomsDBType;
  options?: {
    friend: User | null;
    lastMessage?: LastMessage | null;
  };
}): ChatRoom => {
  console.log("333 dataaa", data);
  const {
    id,
    user1_id,
    user2_id,
    user1_deleted,
    user2_deleted,
    unread_count_user1,
    unread_count_user2,
    created_at,
    user1_deleted_at,
    user2_deleted_at,
  } = data;
  return {
    id: id,
    user1Id: user1_id,
    user2Id: user2_id,
    user1Deleted: user1_deleted,
    user2Deleted: user2_deleted,
    user1DeletedAt: user1_deleted_at,
    user2DeletedAt: user2_deleted_at,
    lastTime: options?.lastMessage?.created_at || new Date(),
    lastMessage: options?.lastMessage?.content || "",
    unreadCountUser1: unread_count_user1,
    unreadCountUser2: unread_count_user2,
    friend: options?.friend || ({} as User),
    createdAt: created_at,
  };
};

export const transformMessage = (data: MessagesDBType): Message => {
  const {
    id,
    chat_room_id,
    sender_id,
    recipient_id,
    content,
    is_read,
    created_at,
  } = data;
  return {
    id: id,
    chatRoomId: chat_room_id,
    senderId: sender_id,
    recipientId: recipient_id,
    content,
    isRead: is_read,
    createdAt: created_at,
  };
};

export const transformMessages = (data: MessagesDBType[]): Message[] => {
  return (data || []).map(
    ({
      id,
      chat_room_id,
      sender_id,
      recipient_id,
      content,
      is_read,
      created_at,
    }) => ({
      id,
      chatRoomId: chat_room_id,
      senderId: sender_id,
      recipientId: recipient_id,
      content,
      isRead: is_read,
      createdAt: created_at,
    })
  );
};
