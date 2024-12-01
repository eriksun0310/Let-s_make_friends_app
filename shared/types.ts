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
  chat_room_id: string;
  content: string;
  created_at: string;
  id: string;
  is_read: boolean;
  recipient_id: string;
  sender_id: string;
};
