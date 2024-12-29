import { FriendRequestsDBType } from "../dbType";
import { FriendRequest } from "../types";

// 轉換為前端可用的格式
export const transformFriendRequests = (
  data: FriendRequestsDBType[]
): FriendRequest[] => {
  return (data || []).map(
    ({
      id,
      sender_id,
      receiver_id,
      status,
      created_at,
      updated_at,
      is_read,
    }) => ({
      id,
      receiverId: receiver_id,
      senderId: sender_id,
      status,
      createdAt: created_at,
      updatedAt: updated_at,
      isRead: is_read,
    })
  );
};
