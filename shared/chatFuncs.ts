import { selectUser, useAppSelector } from "../store";
import { markMessageAsRead } from "../util/handleChatEvent";

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
