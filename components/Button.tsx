import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/style";

interface ButtonProps {
  text: string;
  onPress: () => void;
}
const Button: React.FC<ButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.continueButton} onPress={onPress}>
      <Text style={styles.continueButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: Colors.button,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Button;
