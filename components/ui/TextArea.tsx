import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Colors } from "../../constants/style";

const TextArea = ({ label, multiline = false }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}：</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]} // 如果是多行輸入，則應用 textArea 樣式
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1} // 定義多行輸入的行數
        // onChangeText={onChangeText}
        // value={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    // alignItems: "center",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    width: 110,
  },

  input: {
    height: 40,
    borderWidth: 3,
    padding: 10,
    width: "70%",
    borderRadius: 8,
    borderColor: Colors.button,
  },
  textArea: {
    height: 120, // 調整多行輸入框的高度
    textAlignVertical: "top", // 讓文字從頂部開始輸入
  },
});

export default TextArea;
