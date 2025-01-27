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
import { getUserDetail } from "util/handleUserEvent";
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
          const { data:chatRoomMessages } = await getNewChatRoomMessages({
            chatRoomId: newChatRoom.id,
          });

          // 取得聊天室好友的資料
          const { data: chatRoomFriend } = await getUserDetail({
            userId: transformedChatRoom.user1Id,
          });

          // 新增聊天室
          dispatch(
            addChatRoom({
              ...transformedChatRoom,
              lastMessage: chatRoomMessages.lastMessageData?.content,
              lastTime: chatRoomMessages.lastMessageData?.created_at,
              friend: chatRoomFriend,
            })
          );

          // 新增聊天室的訊息
          dispatch(setMessage(chatRoomMessages.messages));
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, [personal.userId]);
};
