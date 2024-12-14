import { useEffect, useState } from "react";
import { Message } from "../../shared/types";
import {
  selectCurrentChatRoomId,
  selectUser,
  updateOrCreateChatRoom,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { supabase } from "../../util/supabaseClient";
import { updateUnreadCount } from "../../util/handleChatEvent";

export const useChatListeners = () => {
  const personal = useAppSelector(selectUser);
  const userId = personal.userId;
  const currentChatRoomId = useAppSelector(selectCurrentChatRoomId);
  const dispatch = useAppDispatch();

  const [newMessage, setNewMessage] = useState<Message>();
  const [readMessages, setReadMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided, skipping listeners");
      return;
    }

    const subscriptions = [];

    //1. 用於訊息列表的監聽(更新未讀訊息數量)
    const generalSubscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMsg = payload.new;

          console.log("newMsg is useChatListeners", newMsg);

          // 更新本地 chat Redux
          dispatch(
            updateOrCreateChatRoom({
              user1Id: newMsg.sender_id,
              user2Id: newMsg.recipient_id,
              id: newMsg.chat_room_id,
              lastMessage: newMsg.content,
              lastTime: newMsg.created_at,
              incrementUser1: newMsg.recipient_id === userId ? 1 : 0,
              incrementUser2: newMsg.recipient_id !== userId ? 0 : 1,
            })
          );

          // 如果訊息是給自己的，且不在當前聊天室，更新未讀數量
          if (newMsg.recipient_id === userId) {
            // 判斷是否當前聊天室
            const isInSameChatRoom = currentChatRoomId === newMsg.chat_room_id;

            // 只有在不在同一聊天室時，才更新資料庫的未讀數量
            if (!isInSameChatRoom) {
              const result = await updateUnreadCount({
                chatRoomId: newMsg.chat_room_id,
                userId,
              });

              if (!result.success) {
                console.error(
                  "Failed to update unread count in DB:",
                  result.error
                );
              }
            }
            // 如果訊息是自己發的，更新對方聊天室的未讀數量
          }else {
            console.log('newMsg.recipient_id 登出狀態 ', newMsg.recipient_id)
          }
        }
      )
      .subscribe();
    subscriptions.push(generalSubscription);

    // 2. 針對特定聊天室的新訊息監聽
    if (currentChatRoomId) {
      const chatRoomSubscription = supabase
        .channel(`chat_room:${currentChatRoomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_room_id=eq.${currentChatRoomId}`,
          },
          (payload) => {
            console.log("newMsg is useChatListeners", payload.new);
            const newMessage = payload.new;
            console.log(
              "currentChatRoomId is useChatListeners",
              currentChatRoomId
            );

            if (newMessage.chat_room_id === currentChatRoomId) {
              setNewMessage(newMessage);
            }
          }
        )
        .subscribe();
      subscriptions.push(chatRoomSubscription);

      // 3. 針對特定聊天室的已讀訊息監聽
      const readStatusSubscription = supabase
        .channel(`chat_room:${currentChatRoomId}:read_status`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `chat_room_id=eq.${currentChatRoomId}`,
          },
          (payload) => {
            console.log("readMessages is useChatListeners", payload.new);
            setReadMessages((prev) => [...prev, payload.new.id]);
          }
        )
        .subscribe();
      subscriptions.push(readStatusSubscription);
    }

    // 清理所有訂閱
    return () => {
      subscriptions.forEach((subscription) => {
        supabase.removeChannel(subscription);
      });
    };
  }, [userId, currentChatRoomId, dispatch]);

  console.log("newMessage state is useChatListeners", newMessage);
  return {
    newMessage,
    readMessages,
  };
};
