import { FriendRequestsDBType } from "../dbType";
import { FriendRequest } from "../types";

export const transformFriendRequest = (
  data: FriendRequestsDBType
): FriendRequest => {
  const {
    id,
    sender_id,
    receiver_id,
    status,
    created_at,
    updated_at,
    is_read,
  } = data;
  return {
    id,
    receiverId: receiver_id,
    senderId: sender_id,
    status,
    createdAt: created_at,
    updatedAt: updated_at,
    isRead: is_read,
  };
};

export const transformFriendRequests = (
  data: FriendRequestsDBType[]
): FriendRequest[] => {
  return (data || []).map(transformFriendRequest);
};
