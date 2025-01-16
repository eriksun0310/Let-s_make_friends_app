import {
  ImageType,
  OptionList,
  SegmentedButtons,
  Tabs,
  User,
  UserSettings,
} from "./types";

export const tabs: Tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};

// 預設(選項)資料
export const optionList: OptionList = {
  interests: {
    reading: "讀書",
  },

  favoriteFood: {
    chocolate: "巧克力",
  },
  dislikedFood: {
    coriander: "香菜",
    onion: "洋蔥",
  },
};

export const gender = {
  female: "女",
  male: "男",
};

export const segmentedButtons = (
  mode: "personal" | "addPost"
): SegmentedButtons[] =>
  [
    mode === "personal" && {
      value: "all",
      label: "全部",
    },
    {
      value: "public",
      label: "公開",
    },
    {
      value: "friends",
      label: "朋友",
    },
  ].filter(Boolean) as SegmentedButtons[];

export const userInit: User = {
  userId: "",
  name: "",
  gender: "female",
  introduce: "",
  headShot: {
    imageUrl: "",
    imageType: "people",
  },
  selectedOption: {
    interests: [],
    favoriteFood: [],
    dislikedFood: [],
  },
  birthday: "",
  email: "",
};

export const updateUserTitle = {
  name: "姓名",
  introduce: "自我介紹",
};

export const initUserSettings: UserSettings = {
  userId: "",
  hideComments: false,
  hideLikes: false,
  markAsRead: true,
};

export const headShotTabsTitle: Record<ImageType, string> = {
  people: "頭像",
  animal: "動物",
};
