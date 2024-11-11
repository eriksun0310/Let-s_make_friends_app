import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../util/firebaseConfig";

// 即時監聽好友邀請的變化
export const useFriendRequests = (userId: string) => {
  const [friendRequests, setFriendRequests] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const friendRequestsRef = ref(database, "friendRequests");
    const unsubscribe = onValue(friendRequestsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("data ", data);
      const filteredRequests = Object.entries(data || {})
        .filter(([_, request]) => request.receiverId === userId)
        .reduce((acc, [requestId, request]) => {
          console.log("requestId", requestId);
          acc[requestId] = request;
          return acc;
        }, {});

      console.log("filteredRequests", filteredRequests);
      setFriendRequests(filteredRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { friendRequests, loading };
};
