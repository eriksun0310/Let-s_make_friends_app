import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { Colors } from "../../../constants/style";
const CustomSwitch = ({ label }: { label: string }) => {
  const [checked, setChecked] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.labelView}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.switchView}>
        <Switch
          color={Colors.iconBlue}
          value={checked}
          onValueChange={(value) => setChecked(value)}
          style={styles.switch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
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
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});
export default CustomSwitch;
