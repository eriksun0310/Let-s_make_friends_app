import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Tab } from "../../../shared/types";


interface BorderButtonProps {
  currentTab: Tab;
  text: string;
  value: string;
  selectedOption: string[];
  onPress: (v: string, currentTab: Tab) => void;
}

const BorderButton: React.FC<BorderButtonProps> = ({
  currentTab,
  text,
  value,
  selectedOption,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedOption?.includes(value) ? styles.active : null,
        ]}
        onPress={() => {
          onPress(value, currentTab);
        }}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  button: {
    borderRadius: 10, // 圓角
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderWidth: 2, // 外框線
    borderColor: "#ADD8E6", // 黑色的外框線
  },
  active: {
    backgroundColor: "#ADD8E6",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default BorderButton;
