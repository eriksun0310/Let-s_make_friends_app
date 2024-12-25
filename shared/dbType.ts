import { FriendRequestStatus } from "./types";

// 對應 supabase 的資料型態

// 個人資訊
export type UsersDBType = {
  id: string;
  name: string;
  gender: string;
  introduce: string;
  birthday: string;
  email: string;
  created_at: string;
  updated_at: string;
};

// 大頭貼
export type UserHeadShotDBType = {
  id: string;
  user_id: string;
  image_url: string;
  image_type: string;
  created_at: string;
  updated_at: string;
};

// 興趣選項
export type UserSelectedOptionDBType = {
  id: string;
  user_id: string;
  interests: string[];
  favorite_food: string[];
  disliked_food: string[];
  created_at: string;
  updated_at: string;
};

// 好友
export type FriendDBType = {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  notified: string;
};

// 交友請求
export type FriendRequestsDBType = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: FriendRequestStatus;
  created_at: string;
  updated_at: string;
  is_read: boolean;
};

// 聊天室
export type ChatRoomsDBType = {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_deleted: boolean;
  user2_deleted: boolean;
  unread_count_user1: number;
  unread_count_user2: number;
  created_at: Date;
  user1_deleted_at: Date;
  user2_deleted_at: Date;
};

// 訊息
export type MessagesDBType = {
  id: string;
  chat_room_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};
