// import { useEffect, useState } from "react";
// import { supabase } from "../../util/supabaseClient";

// // 監聽 已讀狀態的更新 Hook
// export const useReadMessages = (chatRoomId) => {
//   const [readMessages, setReadMessages] = useState<string[]>([]);

//   useEffect(() => {
//     if (!chatRoomId) return;

//     const subscription = supabase
//       .channel(`chat_room:${chatRoomId}:read_status`)
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "messages",
//           filter: `chat_room_id=eq.${chatRoomId}`,
//         },
//         (payload) => {
//             //console.log('payload', payload.new);
//           setReadMessages((prev) => [...prev, payload.new.id]);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [chatRoomId]);

//   return { readMessages };
// };
