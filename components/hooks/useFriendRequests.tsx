import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";
import { transformFriendRequests } from "../../shared/friend/friendUtils";
import { FriendRequestsDBType } from "../../shared/dbType";
import { selectUser, useAppDispatch, useAppSelector } from "store";
import {
  addFriendRequest,
  deleteBeAddFriend,
  setFriendRequestUnRead,
  updateFriendRequestUnRead,
} from "store/friendSlice";
import { getFriendRequests } from "util/handleFriendsEvent";

// 取得狀態為 pending 的好友邀請
/*
[加好友]
1. insert pending
  addFriendRequest
  deleteBeAddFriend

2. insert rejected
  deleteBeAddFriend

*/

/*
[交友邀請]
1. update pending
  deleteFriendRequest

2. update rejected
  deleteFriendRequest

3. update accepted
  deleteFriendRequest

*/
export const useFriendRequests = () => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const { data, success } = await getFriendRequests({
        userId: personal.userId,
      });

      if (!success) {
        setLoading(false);
        return;
      }

      if (data.length > 0) {
        // 更新未讀的好友邀請數量
        dispatch(
          setFriendRequestUnRead(
            data.filter((req) => req.isRead === false).length
          )
        );
      }

      setLoading(false);
    };

    fetchFriendRequests();

    // 即時監聽好友邀請的變化
    const subscribe = supabase
      .channel("public:friend_requests") // 訂閱 friend_requests 資料表的變化
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friend_requests",
          filter: `receiver_id=eq.${personal.userId}`,
        },
        (payload) => {
          const event = payload.eventType;

          const friendRequests = payload.new as FriendRequestsDBType;
          const friendRequestsStatus = friendRequests.status;
          // 其他人寄給我的(加友、拒絕)邀請
          if (event === "INSERT") {
            // 刪除 "加好友" 的用戶
            dispatch(deleteBeAddFriend(friendRequests.sender_id));
            if (friendRequestsStatus === "pending") {
              const transformedNew = transformFriendRequests([friendRequests]);
              dispatch(addFriendRequest(transformedNew));
              dispatch(updateFriendRequestUnRead());
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscribe.unsubscribe();
    };
  }, [personal.userId]);

  return {
    loading,
  };
};
