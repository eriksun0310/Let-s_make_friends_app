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
