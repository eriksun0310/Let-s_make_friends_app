import React from "react";
import BorderButton from "../ui/BorderButton";
import { View, StyleSheet } from "react-native";
import { Tab, SelectedOption } from "../../shared/types";
import { optionList } from "../../shared/static";

interface RenderOptionProps {
  currentTab: Tab;
  selectedOption: SelectedOption;
  onPress: (v: string, currentTab: Tab) => void;
}
const RenderOption: React.FC<RenderOptionProps> = ({
  currentTab = "interests",
  selectedOption,
  onPress,
}) => {
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
            currentTab={currentTab}
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
