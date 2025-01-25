import { useEffect } from "react";
import { transformChatRoom } from "shared/chat/chatUtils";
import { ChatRoomsDBType } from "shared/dbType";
import { addChatRoom, useAppDispatch } from "store";
import { supabase } from "util/supabaseClient";

/*
INSERT: 新增聊天室 
UPDATE: 更新聊天室未讀數量
DELETE: 刪除聊天室、刪除該聊天室所有的訊息
*/

export const useChatRoomsListeners = () => {
  const dispatch = useAppDispatch();

  // const handleChatRoomsChange = ({
  //   event,
  //   chatRoom,
  // }: {
  //   event: EventType;
  //   chatRoom: ChatRoomsDBType;
  // }) => {
  //   const transformedChatRoom = transformChatRoom({ data: chatRoom });
  //   if (event === "INSERT") {
  //     dispatch(addChatRoom(transformedChatRoom));
  //   }
  // };
  useEffect(() => {
    const subscribe = supabase
      .channel("public:chat_rooms")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
        },
        async (payload) => {
          const newChatRoom = payload.new as ChatRoomsDBType;

          const transformedChatRoom = transformChatRoom({ data: newChatRoom });
          dispatch(addChatRoom(transformedChatRoom));
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, []);
};
