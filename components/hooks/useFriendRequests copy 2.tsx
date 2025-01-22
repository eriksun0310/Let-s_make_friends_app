// import { useState, useEffect } from "react";
// import { supabase } from "../../util/supabaseClient";
// import { transformFriendRequests } from "../../shared/friend/friendUtils";
// import { FriendRequestsDBType } from "../../shared/dbType";
// import { selectUser, useAppDispatch, useAppSelector } from "store";
// import {
//   addFriendRequest,
//   deleteFriendRequest,
//   setFriendRequests,
//   setFriendRequestUnRead,
//   updateFriendRequestUnRead,
// } from "store/friendSlice";
// import { getFriendRequests } from "util/handleFriendsEvent";

// // 取得狀態為 pending 的好友邀請
// export const useFriendRequests = () => {
//   const personal = useAppSelector(selectUser);

//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFriendRequests = async () => {
//       const { data, success } = await getFriendRequests({
//         userId: personal.userId,
//       });

//       if (!success) {
//         setLoading(false);
//         return;
//       }


//       if (data.length > 0) {
//         // TODO：應該是用不到 更新 好友邀請 redux
//         // dispatch(setFriendRequests(data));
//         // 更新未讀的好友邀請數量
//         dispatch(
//           setFriendRequestUnRead(
//             data.filter((req) => req.isRead === false).length
//           )
//         );
//       }

//       setLoading(false);
//     };

//     fetchFriendRequests();

//     // 即時監聽好友邀請的變化
//     const subscription = supabase
//       .channel("public:friend_requests") // 訂閱 friend_requests 資料表的變化
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "friend_requests" },
//         (payload) => {
//           // 對方寄送交友邀請
//           if (
//             payload.eventType === "INSERT" &&
//             payload.new.receiver_id === personal.userId &&
//             payload.new.status === "pending"
//           ) {
//             const newFriendRequest = payload.new as FriendRequestsDBType;
//             const transformedNew = transformFriendRequests([newFriendRequest]);
//             dispatch(addFriendRequest(transformedNew));
//             dispatch(updateFriendRequestUnRead());
//             // 對方接受交友邀請、拒絕交友邀請、刪除交好友頁面的使用者
//           } else if (
//             (payload.eventType === "UPDATE" ||
//               payload.eventType === "INSERT") &&
//             payload.new.status !== "pending"
//           ) {
//             const deletedFriendRequest = payload.old as FriendRequestsDBType;
//             dispatch(deleteFriendRequest(deletedFriendRequest.id));
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription); // 清理訂閱
//     };
//   }, [personal.userId]);

//   return {
//     loading,
//   };
// };
