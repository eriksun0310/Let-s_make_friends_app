import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Colors } from "../constants/style";

interface CustomTextInputProps {
  label: string;
}

//TODO: 要加getValue:()=>{}
const CustomTextInput: React.FC<CustomTextInputProps> = ({ label }) => {
  const [email, setEmail] = useState("");

  return (
    <>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="john@doe.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.button,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
});
export default CustomTextInput;
