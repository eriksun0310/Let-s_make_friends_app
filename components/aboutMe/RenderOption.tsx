import React from "react";
import BorderButton from "../ui/BorderButton";
import { View, StyleSheet } from "react-native";
import { Tab, SelectedOption, OptionList } from "../../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../../store/userSlice";
// 預設資料
const optionList: OptionList = {
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

interface RenderOptionProps {
  currentTab: Tab;
  selectedOption: SelectedOption;
  setSelectedOption: React.Dispatch<React.SetStateAction<SelectedOption>>;
}
const RenderOption: React.FC<RenderOptionProps> = ({
  currentTab = "interests",

  // setSelectedOption,
}) => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const selectedOption = userData.selectedOption;

  const onPress = (v: string) => {
    dispatch(
      setSelectedOption({
        currentTab: currentTab,
        currentOption: v,
      })
    );
  };
  return (
    <View style={styles.TextContainer}>
      {Object.keys(optionList[currentTab])?.map((key) => {
        const option = optionList[currentTab][key];

        return (
          <BorderButton
            text={option} // 香菜、洋蔥
            key={key}
            value={key} // coriander、onion
            selectedOption={selectedOption[currentTab]} //['onion']
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  TextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
export default RenderOption;
