import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../util/firebaseConfig";
import { supabase } from "../../util/supabaseClient";

// 即時監聽好友邀請的變化
// export const useFriendRequests = (userId: string) => {
//   const [friendRequests, setFriendRequests] = useState({});

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const friendRequestsRef = ref(database, "friendRequests");
//     const unsubscribe = onValue(friendRequestsRef, (snapshot) => {
//       const data = snapshot.val();
//       console.log("data ", data);
//       const filteredRequests = Object.entries(data || {})
//         .filter(([_, request]) => request.receiverId === userId)
//         .reduce((acc, [requestId, request]) => {
//           console.log("requestId", requestId);
//           acc[requestId] = request;
//           return acc;
//         }, {});

//       console.log("filteredRequests", filteredRequests);
//       setFriendRequests(filteredRequests);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   return { friendRequests, loading };
// };
export const useFriendRequests = (userId: string) => {
  console.log('userId', userId)
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      // 初始載入好友邀請
      const { data, error } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("receiver_id", userId);


      console.log('data 11111111', data)

      if (error) {
        console.error("Error fetching friend requests:", error);
        setLoading(false);
        return;
      }

      setFriendRequests(data || []);
      setLoading(false);
    };

    fetchFriendRequests();

    // 即時監聽好友邀請的變化
    const subscription = supabase
      .channel("public:friend_requests") // 訂閱 friend_requests 資料表的變化
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        (payload) => {
          console.log("Change received:", payload);

          if (payload.eventType === "INSERT" && payload.new.receiver_id === userId) {
            // 新增好友邀請
            setFriendRequests((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            // 更新好友邀請狀態
            setFriendRequests((prev) =>
              prev.map((req) =>
                req.id === payload.new.id ? payload.new : req
              )
            );
          } else if (payload.eventType === "DELETE") {
            // 刪除好友邀請
            setFriendRequests((prev) =>
              prev.filter((req) => req.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [userId]);


  console.log('friendRequests 111111', friendRequests)

  return { friendRequests, loading };
};
