import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/style";
import { ReactNode } from "react";

interface FlatButtonProps {
  children: ReactNode;
  onPress: () => void;
}

const FlatButton: React.FC<FlatButtonProps> = ({ children, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.primary,
  },
});
