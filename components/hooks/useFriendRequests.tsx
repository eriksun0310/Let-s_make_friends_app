import { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";
import { transformFriendRequests } from "../../shared/friend/friendUtils";
import { FriendRequest } from "../../shared/types";
import { FriendRequestsDBType } from "../../shared/dbType";
import { selectUser, useAppDispatch, useAppSelector } from "store";
import {
  addFriendRequest,
  deleteFriendRequest,
  setFriendRequests,
  setFriendRequestUnRead,
  updateFriendRequestUnRead,
} from "store/friendSlice";

// 取得狀態為 pending 的好友邀請
export const useFriendRequests = () => {
  const personal = useAppSelector(selectUser);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      // 初始載入好友邀請，僅獲取狀態為 pending 的記錄
      const { data, error } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("receiver_id", personal.userId)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching friend requests:", error);
        setLoading(false);
        return;
      }

      // 使用通用转换函数处理数据
      const transformedData = transformFriendRequests(data) || [];
      // 更新 好友邀請 redux
      dispatch(setFriendRequests(transformedData));
      // 更新未讀的好友邀請數量
      dispatch(
        setFriendRequestUnRead(
          transformedData.filter((req) => req.isRead === false).length
        )
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
          // 對方寄送交友邀請
          if (
            payload.eventType === "INSERT" &&
            payload.new.receiver_id === personal.userId &&
            payload.new.status === "pending"
          ) {
            const newFriendRequest = payload.new as FriendRequestsDBType;
            const transformedNew = transformFriendRequests([newFriendRequest]);
            dispatch(addFriendRequest(transformedNew));
            dispatch(updateFriendRequestUnRead());
            // 對方接受交友邀請、拒絕交友邀請、刪除交好友頁面的使用者
          } else if (
            (payload.eventType === "UPDATE" ||
              payload.eventType === "INSERT") &&
            payload.new.status !== "pending"
          ) {
            const deletedFriendRequest = payload.old as FriendRequestsDBType;
            dispatch(deleteFriendRequest(deletedFriendRequest.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // 清理訂閱
    };
  }, [personal.userId]);

  // 標記所有交友邀請為已讀
  // const markInvitationsAsRead = async () => {
  //   const { error } = await supabase
  //     .from("friend_requests")
  //     .update({ is_read: true })
  //     .eq("receiver_id", personal.userId)
  //     .eq("is_read", false); // 只更新尚未讀取的邀請

  //   if (error) {
  //     console.error("Error updating invitation read status:", error);
  //   } else {
  //     dispatch(setFriendRequestUnRead);
  //   }
  // };

  return {
    loading,
    // markInvitationsAsRead,
  };
};
