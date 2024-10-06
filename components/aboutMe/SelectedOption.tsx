import React from "react";
import MultipleText from "../ui/MultipleText";
import {  Tab, Tabs } from "../../shared/types";
import { useSelector } from "react-redux";

const tabs: Tabs = {
  interests: "興趣",
  favoriteFood: "喜歡的食物",
  dislikedFood: "不喜歡的食物",
};

const userDB = {
  interests: ["reading"],
  favoriteFood: ["chocolate"],
};

// 興趣、喜歡的食物、不喜歡的食物
const SelectedOption = () => {
  const userData = useSelector((state) => state.user.userData);

  return (
    <>
      {Object.keys(tabs).map((key) => {
        return (
          <MultipleText
            label={tabs[key as Tab]}
            currentTab={key as Tab}
            dataList={userData.selectedOption[key]}
          />
        );
      })}
    </>
  );
};

export default SelectedOption;
