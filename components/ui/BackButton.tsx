import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/style";

const BackButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.headerIcon}
    >
      <ChevronLeft size={30} color={Colors.icon} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  headerIcon: {
    marginHorizontal: 15,
  },
});

export default BackButton;
