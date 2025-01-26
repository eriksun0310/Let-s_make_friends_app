import { useEffect } from "react";
import { transformChatRoom } from "shared/chat/chatUtils";
import { ChatRoomsDBType } from "shared/dbType";
import {
  addChatRoom,
  selectUser,
  setMessage,
  useAppDispatch,
  useAppSelector,
} from "store";
import { getNewChatRoomMessages } from "util/handleChatEvent";
import { supabase } from "util/supabaseClient";

/*
INSERT: 新增聊天室
*/

export const useChatRoomsListeners = () => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(selectUser);

  useEffect(() => {
    const subscribe = supabase
      .channel("public:chat_rooms")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_rooms",
          filter: `user2_id=eq.${personal.userId}`,
        },
        async (payload) => {
          const newChatRoom = payload.new as ChatRoomsDBType;

          const transformedChatRoom = transformChatRoom({ data: newChatRoom });

          // 取得新聊天室的訊息
          const { data } = await getNewChatRoomMessages({
            chatRoomId: newChatRoom.id,
          });

          // 新增聊天室
          dispatch(
            addChatRoom({
              ...transformedChatRoom,
              lastMessage: data.lastMessageData?.content,
              lastTime: data.lastMessageData?.created_at,
            })
          );

          // 新增聊天室的訊息
          dispatch(setMessage(data.messages));
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, [personal.userId]);
};
