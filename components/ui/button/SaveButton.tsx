import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../../../constants/style";

interface SaveButtonProps {
    onPress: () => void;
}
const SaveButton:React.FC<SaveButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.headerText} onPress={onPress}>
      <Text style={styles.headerTextColor}>儲存</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerText: {
    marginHorizontal: 15,
  },
  headerTextColor: {
    color: Colors.textBlue,
  },
});

export default SaveButton;
