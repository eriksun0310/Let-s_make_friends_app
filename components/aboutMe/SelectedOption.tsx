import React from "react";
import MultipleText from "../ui/MultipleText";
import { Tab } from "../../shared/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { tabs } from "../../shared/static";
import { selectUser, useAppSelector } from "../../store";

// 興趣、喜歡的食物、不喜歡的食物
const SelectedOption = () => {
  const personal = useAppSelector(selectUser);

  return (
    <>
      {Object.keys(tabs).map((key) => {
        return (
          <MultipleText
            key={key}
            currentTab={key as Tab}
            dataList={personal.selectedOption[key]}
          />
        );
      })}
    </>
  );
};

export default SelectedOption;
