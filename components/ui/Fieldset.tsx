import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FieldsetProps {
  title: string;
  children: React.ReactNode;
}

const Fieldset: React.FC<FieldsetProps> = ({ title, children }) => {
  return (
    <View style={styles.fieldset}>
      <Text style={styles.legend}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldset: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  legend: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    fontSize: 16,
    color: "#888888",
  },
});
export default Fieldset;
