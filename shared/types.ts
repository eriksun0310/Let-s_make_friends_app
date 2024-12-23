export type IsValidItem = {
  value: boolean;
  errorText: string;
};

export type LoginIsValid = {
  email: IsValidItem;
  password: IsValidItem;
};
export type LoginForm = Omit<Form, "confirmPassword">;

export type RegisterIsValid = {
  email: IsValidItem;
  password: IsValidItem;
  confirmPassword: IsValidItem;
};

export type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type ImageType = "people" | "animal";

export type HeadShot = {
  imageType: ImageType;
  imageUrl: string;
};

export type Tab = "interests" | "favoriteFood" | "dislikedFood";

export type Tabs = {
  [key in Tab]: string;
};

export type OptionList = {
  interests: { [key: string]: string };
  favoriteFood: { [key: string]: string };
  dislikedFood: { [key: string]: string };
};

export interface SelectedOption {
  [key: string]: string[];
}

export type Gender = "female" | "male";

export type Users = {
  userId: string;
  name: string;
  gender: Gender;
  introduce: string;
  birthday: string;
  email: string;
};

export type User = {
  userId: string;
  name: string;
  gender: Gender;
  birthday: string;
  email: string;
  introduce: string;
  headShot: HeadShot;
  selectedOption: SelectedOption;
};

export type UserState = "personal" | "friend" | "visitor";

export type FriendState = "add" | "accepted";

export type FriendInvitationStatus = "pending" | "accepted" | "rejected";

export type FriendRequest = {
  receiver_id: string;
  sender_id: string;
  status: FriendInvitationStatus;
  createdAt: Date;
};

export type EditUserFieldName =
  | "name"
  | "introduce"
  | "headShot"
  | "selectedOption";

export type Screen = "userInfo" | "aboutMe";

export type Message = {
  content: string;
  created_at: string;
  id: string;
  is_read: boolean;
  recipient_id: string;
  sender_id: string;
};

export type ChatRoom = {
  id: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  unreadCountUser1: number;
  unreadCountUser2: number;
  user1Deleted: boolean;
  user2Deleted: boolean;
  user1DeletedAt: Date;
  user2DeletedAt: Date;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  friend: User;
};

export type ChatRoomState = "old" | "new";
