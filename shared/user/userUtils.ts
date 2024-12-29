import {
  UserHeadShotDBType,
  UsersDBType,
  UserSelectedOptionDBType,
} from "../dbType";
import { User } from "../types";

export const transformUser = ({
  users,
  userHeadShot,
  userSelectedOption,
}: {
  users: UsersDBType;
  userHeadShot: UserHeadShotDBType;
  userSelectedOption: UserSelectedOptionDBType;
}): User => {
  const {
    id,
    name,
    gender,
    introduce,
    birthday,
    email,
    created_at,
    updated_at,
  } = users;

  const headShot = userHeadShot
    ? {
        imageUrl: userHeadShot.image_url,
        imageType: userHeadShot.image_type,
      }
    : {
        imageUrl: "",
        imageType: "people" as ImageType,
      };

  const selectedOption = userSelectedOption
    ? {
        interests: userSelectedOption.interests || [],
        favoriteFood: userSelectedOption.favorite_food || [],
        dislikedFood: userSelectedOption.disliked_food || [],
      }
    : {
        interests: [],
        favoriteFood: [],
        dislikedFood: [],
      };

  return {
    userId: id,
    name,
    gender,
    introduce,
    birthday,
    email,
    createdAt: created_at,
    updatedAt: updated_at,
    headShot,
    selectedOption,
  };
};
