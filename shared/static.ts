import { OptionList, Tabs } from "./types";

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


export const segmentedButtons = [
  {
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
];
