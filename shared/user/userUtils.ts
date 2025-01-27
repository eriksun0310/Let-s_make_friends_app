import {
  UserHeadShotDBType,
  UsersDBType,
  UserSelectedOptionDBType,
  UserSettingsDBType,
} from "../dbType";
import { ImageType, User, UserSettings } from "../types";

export const transformUser = ({
  users,
  userHeadShot,
  userSelectedOption,
  userSettings,
}: {
  users: UsersDBType;
  userHeadShot: UserHeadShotDBType;
  userSelectedOption: UserSelectedOptionDBType;
  userSettings: UserSettingsDBType;
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

  const settings = userSettings
    ? {
        hideLikes: userSettings.hide_likes,
        hideComments: userSettings.hide_comments,
        markAsRead: userSettings.mark_as_read,
      }
    : { hideLikes: false, hideComments: false, markAsRead: true };

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
    settings,
  };
};

export const transformUserSettings = (
  userSettings: UserSettingsDBType
): UserSettings => ({
  userId: userSettings.user_id,
  hideComments: userSettings.hide_comments,
  hideLikes: userSettings.hide_likes,
  markAsRead: userSettings.mark_as_read,
});

export const transformAllUserSettings = (
  userSettings: UserSettingsDBType[]
): UserSettings[] => {
  return (userSettings || []).map(transformUserSettings);
};
