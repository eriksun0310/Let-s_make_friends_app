import React from "react";
import { Colors } from "../../constants/style";
import { View, Text, StyleSheet, TextInput } from "react-native";



interface InputProps {
    label: string;
    multiline?: boolean;
    value: string;
    setValue?: (value: string) => void;
}
const Input: React.FC<InputProps> = ({ label, multiline = false, value, setValue }) => {
  console.log("value", value);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}：</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        onChangeText={setValue}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    width: 100,
  },
  textArea: {
    height: 120, // 調整多行輸入框的高度
    textAlignVertical: "top", // 讓文字從頂部開始輸入
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 3,
    padding: 10,
    width: "70%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
});

export default Input;
