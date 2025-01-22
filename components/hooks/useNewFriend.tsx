import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";
import {
  addFriend,
  selectUser,
  setNewFriendUnRead,
  updateNewFriendUnRead,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { getUserDetail } from "../../util/handleUserEvent";
import { getFriendsUnRead } from "util/handleFriendsEvent";
import { FriendDBType } from "shared/dbType";

// 監聽 成為新好友
export const useNewFriend = () => {
  const personal = useAppSelector(selectUser);
  const userId = personal.userId;

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsUnRead = async () => {
      const { data, success } = await getFriendsUnRead({
        userId: userId,
      });

      if (!success) {
        setLoading(false);
        return;
      }

      if (data.length > 0) {
        dispatch(setNewFriendUnRead(data.length || []));
      }

      setLoading(false);
    };

    fetchFriendsUnRead();

    // 即時監聽好友邀請的變化
    const subscription = supabase
      .channel("public:friends") // 訂閱 friends 資料表的變化
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        async (payload) => {
          const newFriend = payload.new as FriendDBType;
          // 未讀的新好友
          if (
            payload.eventType === "INSERT" &&
            newFriend.user_id === userId &&
            !payload.new.is_read
          ) {
            // 取得詳細的好友資料
            const { data: friendDetails } = await getUserDetail({
              userId: newFriend.friend_id,
            });

            dispatch(addFriend(friendDetails));
            dispatch(updateNewFriendUnRead());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [userId]);

  return { loading };
};
