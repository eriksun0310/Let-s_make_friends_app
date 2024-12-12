import { createContext, useContext } from "react";
import { Message } from "./types";
import { child } from "firebase/database";
import { useChatListeners } from "../components/hooks/useChatListeners";

// 定義 Context 類型
interface Value {
  newMessage: Message | null;
  readMessages: Message[];
}

// 創建 Context
const ChatContext = createContext<Value>({
  newMessage: {} as Message,
  readMessages: [], // TODO: 不確定 是不是 Message[]
});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { newMessage, readMessages } = useChatListeners();

  return (
    <ChatContext.Provider
      value={{
        newMessage,
        readMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
