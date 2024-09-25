import React from "react";
import BorderButton from "../ui/BorderButton";
import { View, StyleSheet } from "react-native";

type CurrentTab = "interests" | "favoriteFood" | "dislikedFood";

interface OptionList {
  interests: { [key: string]: string };
  favoriteFood: { [key: string]: string };
  dislikedFood: { [key: string]: string };
}

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

// 假設這是從db拿
const userDB = {
  interests: ["reading"],
  favoriteFood: ["chocolate"],
  dislikedFood: ["onion"],
};

interface RenderOptionProps {
  currentTab: CurrentTab;
}
const RenderOption: React.FC<RenderOptionProps> = ({
  currentTab = "interests",
}) => {
  return (
    <View style={styles.TextContainer}>
      {Object.keys(optionList[currentTab])?.map((key) => {
        const option = optionList[currentTab][key];
        const defaultValue = userDB[currentTab];

        console.log("defaultValue", defaultValue);

        return (
          <BorderButton
            text={option}
            key={key}
            value={key}
            defaultValue={defaultValue}
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
