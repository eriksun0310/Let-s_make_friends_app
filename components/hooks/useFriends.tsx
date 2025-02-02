import { useState, useEffect } from "react";
import { supabase } from "util/supabaseClient";
import {
  addFriend,
  deleteFriend,
  selectUser,
  setNewFriendUnRead,
  updateNewFriendUnRead,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { getUserDetail } from "../../util/handleUserEvent";
import { getFriendsUnRead } from "util/handleFriendsEvent";
import { FriendDBType } from "shared/dbType";

// 監聽 friends 資料表的變化(INSERT、DELETE)
export const useFriends = () => {
  const personal = useAppSelector(selectUser);
  const userId = personal.userId;

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  // friends 初始資料請求
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
  }, [userId, dispatch]);

  useEffect(() => {
    // 即時監聽好友邀請的變化
    const friendChannel = supabase
      .channel("public:friends") // 訂閱 friends 資料表的變化
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friends",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // 未讀的新好友
          if (!payload.new.is_read) {
            const newFriend = payload.new as FriendDBType;
            // 取得詳細的好友資料
            const { data: friendDetails } = await getUserDetail({
              userId: newFriend.friend_id,
            });

            dispatch(addFriend(friendDetails));
            dispatch(updateNewFriendUnRead());
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "friends",
        },
        (payload) => {
          const currentDeleteFriend = payload.old as FriendDBType;
          if (currentDeleteFriend.user_id === userId) {
            dispatch(deleteFriend(currentDeleteFriend.friend_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendChannel);
    };
  }, [userId, dispatch]);

  return { loading };
};
