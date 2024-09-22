import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

interface BorderButtonProps {
  text: string;
}

const BorderButton: React.FC<BorderButtonProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal:5
    // flex: 1,
  },
  button: {
    // backgroundColor: "#ADD8E6", // 淺藍色
    borderRadius: 10, // 圓角
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderWidth: 2, // 外框線
    borderColor: "#ADD8E6", // 黑色的外框線
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default BorderButton;
