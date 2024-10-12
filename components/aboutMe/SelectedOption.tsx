import React from "react";
import MultipleText from "../ui/MultipleText";
import { Tab } from "../../shared/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { tabs } from "../../shared/static";


// 興趣、喜歡的食物、不喜歡的食物
const SelectedOption = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <>
      {Object.keys(tabs).map((key) => {
        return (
          <MultipleText
            key={key}
            currentTab={key as Tab}
            dataList={user.selectedOption[key]}
          />
        );
      })}
    </>
  );
};

export default SelectedOption;
