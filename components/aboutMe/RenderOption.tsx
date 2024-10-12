import React from "react";
import BorderButton from "../ui/BorderButton";
import { View, StyleSheet } from "react-native";
import { Tab, SelectedOption, OptionList } from "../../shared/types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOption } from "../../store/userSlice";
import { optionList } from "../../shared/static";
import { RootState } from "../../store/store";

interface RenderOptionProps {
  currentTab: Tab;
}
const RenderOption: React.FC<RenderOptionProps> = ({
  currentTab = "interests",
}) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const selectedOption = user.selectedOption;

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
