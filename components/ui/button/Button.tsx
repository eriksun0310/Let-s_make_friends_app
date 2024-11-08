import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import { Colors } from "../../../constants/style";


interface ButtonProps {
  style?: StyleProp<TextStyle>;
  text: string;
  onPress: () => void;
}
const Button: React.FC<ButtonProps> = ({ style, text, onPress }) => {
  return (
    <TouchableOpacity style={[styles.continueButton, style]} onPress={onPress}>
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
