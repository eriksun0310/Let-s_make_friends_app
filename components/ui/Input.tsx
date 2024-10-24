import React from "react";
import { Colors } from "../../constants/style";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StyleProp,
  TextStyle,
} from "react-native";

interface InputProps {
  required?: boolean;
  style?: StyleProp<TextStyle>;
  label: string;
  multiline?: boolean;
  value: string;
  setValue?: (value: string) => void;
}
const Input: React.FC<InputProps> = ({
  required = false,
  style,
  label,
  multiline = false,
  value,
  setValue,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[required ? styles.required : styles.requiredNone]}>*</Text>
      <Text style={styles.label}>{label}：</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea, style]}
        onChangeText={setValue}
        value={value}
        multiline={multiline} //啟用多行輸入
        textAlignVertical="top" // 讓文字從頂部開始輸入
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
    width: 110,
  },
  textArea: {
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    height: 40,
    margin: 13,
    borderWidth: 3,
    padding: 10,
    width: "70%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
  required: {
    color: "#f00", // 紅色
    marginRight: 4, // 與標籤間距
  },
  requiredNone: {
    opacity: 0,

    marginRight: 4, // 與標籤間距
  },
});

export default Input;
