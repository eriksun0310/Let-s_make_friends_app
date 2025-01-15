import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";
import { addFriend, useAppDispatch } from "../../store";
import { getUserDetail } from "../../util/handleUserEvent";

// 監聽 成為新好友
export const useNewFriend = (userId: string) => {
  const dispatch = useAppDispatch();
  const [newFriend, setNewFriend] = useState([]);
  const [newFriendsNumber, setNewFriendsNumber] = useState(0); // 新好友数量
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("user_id", userId)
        .eq("notified", false); // 仅获取未通知的记录

      if (error) {
        console.error("Error fetching friends :", error);
        setLoading(false);
        return;
      }

      setNewFriend(data || []);
      setNewFriendsNumber((data || []).length); // 统计未通知的数量
      setLoading(false);
    };

    fetchFriends();

    // 即時監聽好友邀請的變化
    const subscription = supabase
      .channel("public:friends") // 訂閱 friends 資料表的變化
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        async (payload) => {
          if (
            payload.eventType === "INSERT" &&
            payload.new.user_id === userId &&
            !payload.new.notified // 確保是未通知的紀錄
          ) {
            // 取得詳細的好友資料
            const { data: friendDetails } = await getUserDetail({
              userId: payload.new.user_id,
            });
            dispatch(addFriend(friendDetails));

            setNewFriend((prev) => [...prev, payload.new]);

            setNewFriendsNumber((prev) => prev + 1); // 更新新好友数量
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [userId]);

  // 標記所有新好友為已通知
  const markAllAsNotified = async () => {
    try {
      const { error } = await supabase
        .from("friends")
        .update({ notified: true }) // 更新为已通知
        .eq("user_id", userId)
        .eq("notified", false); // 仅更新未通知的记录

      if (error) {
        console.error("Error updating notified status:", error);
      } else {
        setNewFriendsNumber(0); // 重置本地状态
      }
    } catch (err) {
      console.error("Error marking friends as notified:", err);
    }
  };

  return { newFriend, loading, newFriendsNumber, markAllAsNotified };
};
