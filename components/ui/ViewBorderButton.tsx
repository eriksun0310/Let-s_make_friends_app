import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

interface BorderButtonProps {
  text: string;
}

const ViewBorderButton: React.FC<BorderButtonProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.button, text ? styles.active : null]}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
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
    // backgroundColor:'#ADD8E6'
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

export default ViewBorderButton;
