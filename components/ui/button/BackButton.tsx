import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "../../../constants/style";
import { NavigationProp } from "@react-navigation/native";

interface BackButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const BackButton: React.FC<BackButtonProps> = ({ style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
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
