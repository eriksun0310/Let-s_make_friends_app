import { selectUser, useAppSelector } from "../store";
import {
  markMessageAsRead,
  resetDeleteChatRoomDB,
} from "../util/handleChatEvent";

// 處理訊息的分隔符
export const processMessageWithSeparators = (messages) => {
  return messages.map((msg, index) => {
    // 判斷是否需要渲染分隔符
    if (
      !msg.is_read &&
      (index === messages.length - 1 || messages[index + 1]?.is_read)
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
    const hasSeparator = messagesData.some((message) => !message.is_read);
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

// 重製聊天室
export const resetDeleteChatRoomState = async ({ chatRoom, userId }) => {
  const isUser1 = chatRoom.user1Id === userId;
  let deletedColumn = isUser1 ? "user1Deleted" : "user2Deleted";

  // 如果有刪除聊天室的話, 再次點進那個聊天室 要重置聊天室的刪除狀態
  if (chatRoom[deletedColumn]) {
    await resetDeleteChatRoomDB({
      roomId: chatRoom.id,
      userId: userId,
    });
  }
};
