import { selectUser, useAppSelector } from "../store";
import {
  markMessageAsRead,
  resetDeleteChatRoomDB,
} from "../util/handleChatEvent";
import { ChatRoom, Message } from "./types";

// 處理訊息的分隔符
export const processMessageWithSeparators = (messages) => {
  return messages.map((msg, index) => {
    // 判斷是否需要渲染分隔符
    if (
      !msg.isRead &&
      (index === messages.length - 1 || messages[index + 1]?.isRead)
    ) {
      return { ...msg, showSeparator: true };
    }
    return { ...msg, showSeparator: false };
  });
};

//   當訊息渲染時自動標記為已讀
export const handleMessageView = async (messageId: string) => {
  const personal = useAppSelector(selectUser);

  if (messageId && messageId !== personal.userId) {
    await markMessageAsRead(messageId);
  }
};

export const getProcessedChatData = ({ chatRoom, userId, messagesData }) => {
  console.log("chatRoom getProcessedChatData", chatRoom);
  //判斷對方有沒有刪除聊天室
  let deletedColumn =
    chatRoom.user1Id === userId ? "user2_deleted" : "user1_deleted";

  let processedChatData = [];
  console.log("deletedColumn", deletedColumn);

  console.log("chatRoom[deletedColumn]", chatRoom[deletedColumn]);

  // 對方刪除聊天室
  if (chatRoom[deletedColumn]) {
    console.log("messagesData 1111", messagesData);
    // 判斷是否需要分隔符
    const hasSeparator = messagesData.some((message) => !message.isRead);
    console.log("hasSeparator 2222", hasSeparator);

    processedChatData = processMessageWithSeparators(messagesData);
    return {
      hasSeparator: hasSeparator,
      processedChatData,
    };
  } else {
    return {
      hasSeparator: false,
      processedChatData: messagesData,
    };
  }
};

type DeletedColumn = "user1Deleted" | "user2Deleted";
// 重製聊天室
export const resetDeleteChatRoomState = async ({
  chatRoom,
  userId,
}: {
  chatRoom: ChatRoom;
  userId: string;
}) => {
  const isUser1 = chatRoom.user1Id === userId;
  let deletedColumn = (
    isUser1 ? "user1Deleted" : "user2Deleted"
  ) as DeletedColumn;

  // 如果有刪除聊天室的話, 再次點進那個聊天室 要重置聊天室的刪除狀態
  if (chatRoom[deletedColumn]) {
    await resetDeleteChatRoomDB({
      chatRoomId: chatRoom.id,
      userId: userId,
    });
  }
};

type MessageDBType = {
  id: string;
  chat_room_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export const transformMessage = (data: MessageDBType): Message => {
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

export const transformMessageArray = (data: MessageDBType[]): Message[] => {
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
