import { useEffect, useState } from "react";
import { transformMessage } from "shared/chat/chatUtils";
import { MessagesDBType } from "shared/dbType";
import { EventType } from "shared/types";
import {
  addMessage,
  resetDeletedChatRoomState,
  selectChatRooms,
  selectCurrentChatRoomId,
  selectUser,
  setUserOffline,
  setUserOnline,
  updateAllMessageIsRead,
  updateChatRoomLastMessage,
  updateChatRoomUnreadCount,
  useAppDispatch,
  useAppSelector,
} from "store";
import { resetDeleteChatRoomDB, updateUnreadCount } from "util/handleChatEvent";
import { supabase } from "util/supabaseClient";

/*
INSERT: 新增訊息、更新聊天室最後一則訊息、更新聊天室最後一則訊息時間
UPDATE: 更新訊息已讀狀態

*/
export const useMessagesListeners = () => {
  const chatRoomsData = useAppSelector(selectChatRooms);
  const chatRoomIds = chatRoomsData.map((room) => room.id);

  const personal = useAppSelector(selectUser);
  const userId = personal.userId;
  const currentChatRoomId = useAppSelector(selectCurrentChatRoomId);
  const dispatch = useAppDispatch();

  const [presenceChannel, setPresenceChannel] = useState<any>(null);

  // 初始化 Presence
  useEffect(() => {
    if (!userId) return;
    // 初始化 Presence 渠道
    const channel = supabase.channel("chat_presence");
    channel
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // console.log("presence channel subscribed successfully");
          channel.track({
            user_id: userId,
            chat_room_id: currentChatRoomId || null,
            status: "online",
          });
        }
      })

      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        newPresences.forEach((presence) => {
          if (presence.user_id !== userId && presence.chat_room_id) {
            dispatch(setUserOnline(presence.user_id));
          }
        });
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        leftPresences.forEach((presence) => {
          if (presence.user_id !== userId && presence.chat_room_id) {
            dispatch(setUserOffline(presence.user_id));
          }
        });
      });

    setPresenceChannel(channel);
    return () => {
      channel.unsubscribe();
    };
  }, [currentChatRoomId]);

  // 檢查目標用戶是否在線
  const isUserInRoom = (recipientId: string, chatRoomId: string): boolean => {
    if (!presenceChannel) return false;
    const presenceState = presenceChannel.presenceState();

    return Object.values(presenceState).some((connections: any[]) =>
      connections.some(
        (conn) =>
          conn.user_id === recipientId && conn.chat_room_id === chatRoomId
      )
    );
  };

  // 監聽使用者所有聊天室的訊息
  useEffect(() => {
    const messagesChannel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=in.(${chatRoomIds.join(",")})`,
        },
        async (payload) => {
          const event = payload.eventType;

          if (event === "INSERT") {
            const newMessage = payload.new as MessagesDBType;

            // 檢查是否有刪除聊天室
            const findDeleteChatRoom = chatRoomsData.find(
              (chatRoom) => chatRoom.id === newMessage.chat_room_id
            );

            if (
              findDeleteChatRoom?.user1Deleted ||
              findDeleteChatRoom?.user2Deleted
            ) {
              // 重置聊天室刪除狀態
              dispatch(resetDeletedChatRoomState(newMessage.chat_room_id));
              await resetDeleteChatRoomDB({
                deletedColumn: findDeleteChatRoom?.user1Deleted
                  ? "user1Deleted"
                  : "user2Deleted",
                chatRoomId: newMessage.chat_room_id,
              });
            }

            const transformedMessage = transformMessage(newMessage);

            const hasUserOffline =
              newMessage.sender_id === userId &&
              !isUserInRoom(newMessage.recipient_id, newMessage.chat_room_id);

            // 當 (使用者離開應用程式、不在聊天室) 更新 資料庫 未讀數量
            if (hasUserOffline) {
              await updateUnreadCount({
                chatRoomId: newMessage.chat_room_id,
                userId: newMessage.recipient_id,
              });
            }
            //  更新聊天室未讀數量
            if (newMessage.recipient_id === userId) {
              dispatch(
                updateChatRoomUnreadCount({
                  chatRoomId: newMessage.chat_room_id,
                  recipientId: newMessage.recipient_id,
                })
              );
            }

            //  更新聊天室最後一則訊息資訊
            dispatch(updateChatRoomLastMessage(transformedMessage));

            if (transformedMessage.recipientId === userId) {
              // : 新增訊息
              dispatch(addMessage(transformedMessage));
            }
          } else if (event === "UPDATE") {
            const newMessage = payload.new as MessagesDBType;
            // 更新訊息的已讀狀態
            dispatch(
              updateAllMessageIsRead({
                chatRoomId: newMessage.chat_room_id,
                userId: userId,
              })
            );
          }
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [chatRoomIds]);

  // 監聽 目前聊天室的訊息
  // useEffect(() => {
  //   const subscribe = supabase
  //     .channel("public:messages")
  //     // 監聽 目前聊天室的訊息
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "messages",
  //         filter: `chat_room_id=eq.${currentChatRoomId}`,
  //       },
  //       async (payload) => {
  //         const event = payload.eventType;
  //         const newMessage = payload.new as MessagesDBType;

  //         if (event !== "DELETE") {
  //           handleMessagesChange({ event, message: newMessage });
  //         }
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     subscribe.unsubscribe();
  //   };
  // }, [currentChatRoomId]);
};
