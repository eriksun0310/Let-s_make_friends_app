import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";




export const useNewFriend = (userId: string) => {
  const [newFriend, setNewFriend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      // 初始載入好友邀請，僅獲取狀態為 pending 的記錄
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("user_id", userId)

      if (error) {
        console.error("Error fetching friends :", error);
        setLoading(false);
        return;
      }

      setNewFriend(data || []);
      setLoading(false);
    };

    fetchFriendRequests();

    // 即時監聽好友邀請的變化
    const subscription = supabase
      .channel("public:friends") // 訂閱 friends 資料表的變化
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        (payload) => {
          console.log("Change received friends :", payload);

          if (payload.eventType === "INSERT" && 
              payload.new.user_id === userId) {
            setNewFriend((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [userId]);

  console.log("newFriend:", newFriend);

  return { newFriend, loading };
};
