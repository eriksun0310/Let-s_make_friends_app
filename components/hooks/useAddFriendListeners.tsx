import React, { useEffect } from "react";
import { FriendRequestsDBType } from "shared/dbType";
import { transformFriendRequests } from "shared/friend/friendUtils";
import {
  addFriendRequest,
  deleteBeAddFriend,
  selectUser,
  updateFriendRequestUnRead,
  useAppDispatch,
  useAppSelector,
} from "store";
import { supabase } from "util/supabaseClient";

// 用於 AddFriend.tsx 的監聽
export const useAddFriendListeners = () => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscription = supabase
      .channel("public:friend_requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friend_requests" },
        (payload) => {
          const insertFriendRequest = payload.new as FriendRequestsDBType;

          // 自己發出的好友邀請不做任何處理
          if (insertFriendRequest.sender_id === personal.userId) {
            return;
          }
          dispatch(deleteBeAddFriend(insertFriendRequest.sender_id));
          // 收到使用者寄給我的好友邀請
          if (insertFriendRequest.status === "pending") {
            const transformedFriendRequests = transformFriendRequests([
              insertFriendRequest,
            ]);
            dispatch(addFriendRequest(transformedFriendRequests));
            dispatch(updateFriendRequestUnRead());
          } 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [personal.userId]);
};
