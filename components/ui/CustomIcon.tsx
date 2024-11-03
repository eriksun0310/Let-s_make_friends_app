import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface IconProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: React.ReactNode;
}

const CustomIcon: React.FC<IconProps> = ({ style, onPress, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style ? style : styles.headerIcon}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    marginHorizontal: 15,
  },
});

export default CustomIcon;
