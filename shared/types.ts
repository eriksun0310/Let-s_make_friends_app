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

export type User = {
  userId: string;
  name: string;
  gender: Gender;
  introduce: string;
  headShot: HeadShot;
  selectedOption: SelectedOption;
  birthday: string;
  email: string;
};

export type UserState = "personal" | "friend" | "visitor";

export type FriendState = "add" | "confirm";

export type FriendInvitationStatus = "pending" | "accepted" | "rejected";

export type FriendRequest = {
  receiverId: string;
  senderId: string;
  status: FriendInvitationStatus;
  createdAt: Date;
};
