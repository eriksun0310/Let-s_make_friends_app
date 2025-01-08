import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { Colors } from "../../../constants/style";

interface CustomSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}
const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelView}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.switchView}>
        <Switch
          color={Colors.iconBlue}
          value={value}
          onValueChange={(value) => onChange(value)}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    marginHorizontal: 15,
  },
  labelView: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
  },
  switchView: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
    justifyContent: "flex-end",
  },
  switch: {
    // transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }],
  },
});
export default CustomSwitch;
