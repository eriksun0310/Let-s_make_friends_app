import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
const TextLabel = ({ label, value }) => {
    console.log("value", value);
  return (
    <Text style={styles.label}>
      {label}：{value}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
});

export default TextLabel;
