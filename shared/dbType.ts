import {
  FriendRequestStatus,
  Gender,
  ImageType,
  PostVisibility,
} from "./types";

// 對應 supabase 的資料型態

// 個人資訊
export type UsersDBType = {
  id: string;
  name: string;
  gender: Gender;
  introduce: string;
  birthday: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

// 大頭貼
export type UserHeadShotDBType = {
  image_url: string;
  image_type: ImageType;
};

// 興趣選項
export type UserSelectedOptionDBType = {
  interests: string[];
  favorite_food: string[];
  disliked_food: string[];
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
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
};

// tags
export type PostTagsDBType = {
  id: string;
  post_id: string;
  tag: string;
};

// 文章
export type PostsDBType = {
  id: string;
  user_id: string;
  content: string;
  visibility: PostVisibility;
  created_at: Date;
  updated_at: Date;
};

// 文章留言
export type PostCommentsDBType = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
};

// 文章按讚數
export type PostLikesDBType = {
  post_id: string;
  user_id: string;
  created_at: Date;
};

//用戶設定
export type UserSettingsDBType = {
  user_id: string;
  hide_likes: boolean;
  hide_comments: boolean;
  mark_as_read: boolean;
};
