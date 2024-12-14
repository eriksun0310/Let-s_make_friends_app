import { createContext, useContext, useMemo } from "react";
import { Message } from "./types";
import { useChatListeners } from "../components/hooks/useChatListeners";

// 定義 Context 類型
interface Value {
  newMessage: Message | null;
  readMessages: Message[];
}

// 創建 Context
const ChatContext = createContext<Value>({
  newMessage: null,
  readMessages: [], // TODO: 不確定 是不是 Message[]
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { newMessage, readMessages } = useChatListeners();

  // const value = {
  //   newMessage: newMessage || null,
  //   readMessages,
  // };

  const value = useMemo(
    () => ({
      newMessage: newMessage || null, // 確保初始值不為 undefined
      readMessages: readMessages || [], // 確保初始值不為 undefined
    }),
    [newMessage, readMessages]
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
