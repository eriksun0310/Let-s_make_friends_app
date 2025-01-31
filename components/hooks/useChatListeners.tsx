// import { useEffect, useState } from "react";
// import { Message } from "../../shared/types";
// import {
//   selectCurrentChatRoomId,
//   selectUser,
//   selectUserOnline,
//   setUserOffline,
//   setUserOnline,
//   updateOrCreateChatRoom,
//   useAppDispatch,
//   useAppSelector,
// } from "../../store";
// import { supabase } from "../../util/supabaseClient";
// import {
//   markMessageAsRead,
//   updateUnreadCount,
// } from "../../util/handleChatEvent";
// import { AppState } from "react-native";
// import { transformMessage } from "../../shared/chat/chatUtils";
// import { MessagesDBType } from "../../shared/dbType";


// // 這個 已經改用 useChatRoomsListeners ＋ useMessagesListeners
// export const useChatListeners = () => {
//   const personal = useAppSelector(selectUser);
//   const userId = personal.userId;
//   const currentChatRoomId = useAppSelector(selectCurrentChatRoomId);
//   const dispatch = useAppDispatch();

//   const [newMessage, setNewMessage] = useState<Message>();
//   const [readMessages, setReadMessages] = useState<Message[]>([]);
//   const [presenceChannel, setPresenceChannel] = useState<any>(null);

//   const onlineUsers = useAppSelector(selectUserOnline);

//   // 初始化 Presence
//   useEffect(() => {
//     if (!userId) return;
//     // 初始化 Presence 渠道
//     const channel = supabase.channel("chat_presence");
//     channel
//       .subscribe((status) => {
//         if (status === "SUBSCRIBED") {
//           // console.log("presence channel subscribed successfully");
//           channel.track({
//             user_id: userId,
//             chat_room_id: currentChatRoomId || null,
//             status: "online",
//           });
//         }
//       })

//       .on("presence", { event: "join" }, ({ key, newPresences }) => {
//         newPresences.forEach((presence) => {
//           if (presence.user_id !== userId && presence.chat_room_id) {
//             dispatch(setUserOnline(presence.user_id));
//           }
//         });
//       })
//       .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
//         leftPresences.forEach((presence) => {
//           if (presence.user_id !== userId && presence.chat_room_id) {
//             dispatch(setUserOffline(presence.user_id));
//           }
//         });
//       });

//     setPresenceChannel(channel);
//     return () => {
//       channel.unsubscribe();
//     };
//   }, [currentChatRoomId]);

//   // 檢查目標用戶是否在線
//   const isUserInRoom = (recipientId: string, chatRoomId: string): boolean => {
//     if (!presenceChannel) return false;
//     const presenceState = presenceChannel.presenceState();

//     return Object.values(presenceState).some((connections: any[]) =>
//       connections.some(
//         (conn) =>
//           conn.user_id === recipientId && conn.chat_room_id === chatRoomId
//       )
//     );
//   };

//   // 新訊息監聽
//   useEffect(() => {
//     if (!userId) return;

//     const subscriptions = [];

//     // 通用訊息監聽(for 聊天列表)
//     const generalSubscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//         },
//         async (payload) => {
//           const newMsg = payload.new;
//           // console.log("新訊息監聽", newMsg);

//           // 更新本地 chat Redux
//           dispatch(
//             updateOrCreateChatRoom({
//               user1Id: newMsg.sender_id,
//               user2Id: newMsg.recipient_id,
//               id: newMsg.chat_room_id,
//               lastMessage: newMsg.content,
//               lastTime: newMsg.created_at,
//               incrementUser1: newMsg.recipient_id === userId ? 1 : 0,
//               incrementUser2: newMsg.recipient_id !== userId ? 0 : 1,
//             })
//           );

//           // 當 (使用者離開應用程式、不在聊天室) 更新 資料庫 未讀數量
//           if (
//             newMsg.sender_id === userId &&
//             !isUserInRoom(newMsg.recipient_id, newMsg.chat_room_id)
//           ) {
//             await updateUnreadCount({
//               chatRoomId: newMsg.chat_room_id,
//               userId: newMsg.recipient_id,
//             });
//           }
//         }
//       )
//       .subscribe();

//     subscriptions.push(generalSubscription);

//     // 當前聊天室的新訊息監聽
//     if (currentChatRoomId) {
//       const chatRoomSubscription = supabase
//         .channel(`chat_room:${currentChatRoomId}`)
//         .on(
//           "postgres_changes",
//           {
//             event: "INSERT",
//             schema: "public",
//             table: "messages",
//             filter: `chat_room_id=eq.${currentChatRoomId}`,
//           },
//           async (payload) => {
//             const insertNewMessage = payload.new as MessagesDBType;
//             const transformedMessage = transformMessage(insertNewMessage);
//             // 如果是對方的訊息, 標記為已讀
//             if (insertNewMessage?.recipient_id === userId) {
//               await markMessageAsRead(insertNewMessage.id);
//             }

//             // 更新本地狀態
//             setNewMessage(transformedMessage);
//           }
//         )
//         .subscribe();

//       subscriptions.push(chatRoomSubscription);

//       // 當前聊天室的已讀訊息監聽
//       const readStatusSubscription = supabase
//         .channel(`chat_room:${currentChatRoomId}:read_status`)
//         .on(
//           "postgres_changes",
//           {
//             event: "UPDATE",
//             schema: "public",
//             table: "messages",
//             filter: `chat_room_id=eq.${currentChatRoomId}`,
//           },
//           (payload) => {
//             const readMessage = payload.new;

//             setReadMessages((prev) => [...prev, readMessage.id]);
//           }
//         )
//         .subscribe();

//       subscriptions.push(readStatusSubscription);
//     }

//     // 清理所有訂閱
//     return () => {
//       subscriptions.forEach((sub) => supabase.removeChannel(sub));
//     };
//   }, [userId, currentChatRoomId, presenceChannel, dispatch]);
//   // useEffect(() => {
//   //   const handleAppStateChange = async (state: string) => {
//   //     // console.log("handleAppStateChange", state);
//   //     // console.log("handleAppStateChange userId", userId);
//   //     console.log("state", state);
//   //     if (state === "background") {
//   //       console.log(" 1111 App moved to background");

//   //       // 應用切到背景時，清理 Presence 狀態
//   //       if (presenceChannel) {
//   //         await presenceChannel.untrack();
//   //         console.log("Untracked presence");
//   //       }

//   //       // 更新未讀數量
//   //       // if (currentChatRoomId) {
//   //       //   try {
//   //       //     const result = await updateUnreadCount({
//   //       //       chatRoomId: currentChatRoomId,
//   //       //       userId,
//   //       //     });
//   //       //     console.log("result", result);
//   //       //     if (result.success) {
//   //       //       console.log("Updated unread count successfully");
//   //       //     } else {
//   //       //       console.error("Failed to update unread count:", result.error);
//   //       //     }
//   //       //   } catch (error) {
//   //       //     console.error("Error updating unread count:", error);
//   //       //   }
//   //       // }
//   //     } else if (state === "active") {
//   //       console.log("2222 App moved to foreground");

//   //       // 應用切回前台時，重新跟蹤 Presence 狀態
//   //       if (presenceChannel) {
//   //         try {
//   //           await presenceChannel.track({
//   //             user_id: userId,
//   //             chat_room_id: currentChatRoomId || null,
//   //             status: "online",
//   //           });
//   //           console.log("Tracked presence");
//   //         } catch (error) {
//   //           console.error("Error tracking presence:", error);
//   //         }
//   //       }
//   //     }
//   //   };

//   //   const subscription = AppState.addEventListener(
//   //     "change",
//   //     handleAppStateChange
//   //   );

//   //   return () => {
//   //     subscription.remove();
//   //   };
//   // }, []);
//   return {
//     newMessage,
//     readMessages,
//   };
// };
