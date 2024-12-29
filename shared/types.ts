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
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  userId: string;
  name: string;
  gender: Gender;
  introduce: string;
  birthday: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  headShot: HeadShot;
  selectedOption: SelectedOption;
  
};

export type UserState = "personal" | "friend" | "visitor";

export type FriendState = "add" | "accepted";

export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export type FriendRequest = {
  id: string;
  receiverId: string;
  senderId: string;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
};

export type EditUserFieldName =
  | "name"
  | "introduce"
  | "headShot"
  | "selectedOption";

export type Screen = "userInfo" | "aboutMe";

export type Message = {
  id: string;
  chatRoomId: string;
  content: string;
  isRead: boolean;
  recipientId: string;
  senderId: string;
  createdAt: string;
};

export type ChatRoom = {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Deleted: boolean;
  user2Deleted: boolean;
  user1DeletedAt: Date;
  user2DeletedAt: Date;
  lastTime: Date;
  lastMessage: string;
  unreadCountUser1: number;
  unreadCountUser2: number;
  friend: User;
  createdAt: Date;
};

export type ChatRoomState = "old" | "new";
