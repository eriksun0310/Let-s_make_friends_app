import React, { useEffect, useState } from "react";
import { supabase } from "../../util/supabaseClient";
import { Message } from "../../shared/types";
import { selectCurrentChatRoomId, useAppSelector } from "../../store";

const initialMessage = {
  chat_room_id: "",
  content: "",
  created_at: "",
  id: "",
  is_read: false,
  recipient_id: "",
  sender_id: "",
};

// export const useNewMessages = ({ chatRoomId }: { chatRoomId: string }) => {
//   const [newMessage, setNewMessage] = useState<Message>();

//   useEffect(() => {
//     if (!chatRoomId) return;

//     const subscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "messages" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setNewMessage(payload.new);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       // 確保在組件卸載時取消訂閱
//       supabase.removeChannel(subscription); // 清理訂閱
//     };
//   }, [chatRoomId]);

//   return {
//     newMessage,
//   };
// };

// 新訊息的監聽
// export const useNewMessages = () => {
//   const [newMessage, setNewMessage] = useState<Message>();

//   const chatRoomId = useAppSelector(selectCurrentChatRoomId);
//   useEffect(() => {
//     if (!chatRoomId) return;

//     const subscription = supabase
//       .channel(`chat_room:${chatRoomId}`) // Specific channel for this chat room
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `chat_room_id=eq.${chatRoomId}`,
//         },
//         (payload) => {
//           setNewMessage(payload.new);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [chatRoomId]);
//   console.log("newMessage state is useNewMessages", newMessage);
//   return { newMessage };
// };
