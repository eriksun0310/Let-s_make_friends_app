import { resetDeleteChatRoomDB } from "../../util/handleChatEvent";
import { ChatRoom } from "../types";

/* chatFuncs.ts 專注於業務邏輯*/

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


// 重製聊天室
export const resetDeleteChatRoomState = async ({
  chatRoom,
  userId,
}: {
  chatRoom: ChatRoom | null;
  userId: string;
}) => {
  const deletedColumn =
    chatRoom?.user1Id === userId ? "user1Deleted" : "user2Deleted";

  // 如果有刪除聊天室的話, 再次點進那個聊天室 要重置聊天室的刪除狀態
  if (chatRoom?.[deletedColumn]) {
    await resetDeleteChatRoomDB({
      deletedColumn: deletedColumn,
      chatRoomId: chatRoom.id,
    });
  }
};
