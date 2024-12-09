import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../../util/supabaseClient";
import { updateChatRoom, updateOrCreateChatRoom } from "../../store/chatSlice";
import { updateUnreadCount } from "../../util/handleChatEvent";

// 監聽所有聊天室的新訊息, 並根據訊息狀態,更新未讀訊息數量
export const useUnreadCount = ({
  userId,
  currentChatRoomId,
}: {
  userId: string;
  currentChatRoomId: string | null;
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;

    // 監聽新訊息
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new;

          console.log("newMessage is useUnreadCount", newMessage);

          // 更新本地 chat Redux
          dispatch(
            updateOrCreateChatRoom({
              user1Id: newMessage.sender_id,
              user2Id: newMessage.recipient_id,
              id: newMessage.chat_room_id,
              lastMessage: newMessage.content,
              lastTime: newMessage.created_at,

              // incrementUser1:
              //   newMessage.recipient_id === userId &&
              //   newMessage.sender_id !== userId
              //     ? 1
              //     : 0,
              // incrementUser2:
              //   newMessage.recipient_id !== userId &&
              //   newMessage.sender_id === userId
              //     ? 0
              //     : 1,
              incrementUser1: newMessage.recipient_id === userId ? 1 : 0,
              incrementUser2: newMessage.recipient_id !== userId ? 0 : 1,
            })
          );

          // 當訊息是發給自己的, 更新supabase 未讀數量
          // if (newMessage.recipient_id === userId) {
          //   const result = await updateUnreadCount({
          //     chatRoomId: newMessage.chat_room_id,
          //     userId,
          //   });

          //   if (!result.success) {
          //     console.error(
          //       "Failed to update unread count in DB:",
          //       result.error
          //     );
          //   }
          // }

          //console.log("newMessage 111111", newMessage);
          // 當訊息是發給自己的
          if (newMessage.recipient_id === userId) {
            // 判斷是否當前聊天室
            const isInSameChatRoom =
              currentChatRoomId === newMessage.chat_room_id;

            // 只有在不在同一聊天室時，才更新資料庫的未讀數量
            if (!isInSameChatRoom) {
              const result = await updateUnreadCount({
                chatRoomId: newMessage.chat_room_id,
                userId,
              });

              if (!result.success) {
                console.error(
                  "Failed to update unread count in DB:",
                  result.error
                );
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理監聽
    };
  }, [userId, dispatch, currentChatRoomId]);
};
