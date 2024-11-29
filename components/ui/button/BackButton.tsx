import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Colors } from "../../../constants/style";
import { NavigationProp } from "@react-navigation/native";

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  navigation: NavigationProp<any, any>;
}
const BackButton: React.FC<BackButtonProps> = ({ style, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={style ? style : styles.headerIcon}
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
