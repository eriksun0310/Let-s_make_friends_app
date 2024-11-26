import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";

// 取得狀態為 pending 的好友邀請
export const useFriendRequests = (userId: string) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFriendRequestNumber, setNewFriendRequestNumber] = useState(0); // 新好友数量

  useEffect(() => {
    const fetchFriendRequests = async () => {
      // 初始載入好友邀請，僅獲取狀態為 pending 的記錄
      const { data, error } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("receiver_id", userId)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching friend requests:", error);
        setLoading(false);
        return;
      }

      // 更新本地的好友邀请数据，包括未读和已读的
      setFriendRequests(data || []);
      setNewFriendRequestNumber(
        (data || []).filter((req) => req.is_read === false).length
      );
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

          if (
            payload.eventType === "INSERT" &&
            payload.new.receiver_id === userId &&
            payload.new.status === "pending"
          ) {
            // 新增好友邀請，且狀態為 pending
            setFriendRequests((prev) => [...prev, payload.new]);
            setNewFriendRequestNumber((prev) => prev + 1); // 更新交友邀請數量
          } else if (
            payload.eventType === "DELETE" ||
            (payload.eventType === "UPDATE" && payload.new.status !== "pending")
          ) {
            // 刪除好友邀請或狀態改變（非 pending）
            setFriendRequests((prev) =>
              prev.filter((req) => req.id !== payload.old?.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [userId]);

  // 標記所有交友邀請為已讀
  const markInvitationsAsRead = async () => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ is_read: true })
      .eq("receiver_id", userId)
      .eq("is_read", false); // 只更新尚未讀取的邀請

    if (error) {
      console.error("Error updating invitation read status:", error);
    } else {
      setNewFriendRequestNumber(0);
    }
  };

  return {
    friendRequests,
    loading,
    newFriendRequestNumber,
    markInvitationsAsRead,
  };
};
