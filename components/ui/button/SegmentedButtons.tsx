import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../constants/style";


interface ButtonConfig {
  value: string;
  label: string;
}
interface SegmentedButtonProps {
  buttons: ButtonConfig[];
  onValueChange: (value: string) => void;
  initialValue?: string;
}

const SegmentedButtons: React.FC<SegmentedButtonProps> = ({
  buttons,
  onValueChange,
  initialValue,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    initialValue || buttons[0].value
  );

  const handlePress = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={button.value}
          style={[
            styles.button,
            index === 0 && styles.firstButton,
            index === buttons.length - 1 && styles.lastButton,
            selectedValue === button.value && styles.selectedButton,
          ]}
          onPress={() => handlePress(button.value)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedValue === button.value && styles.selectedButtonText,
            ]}
          >
            {button.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 8,
    // borderColor: "#E5E5E5",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cecece",
  },
  firstButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#cecece",
  },
  buttonText: {
    color: Colors.textGrey,
    fontSize: 14,
  },
  selectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SegmentedButtons;
