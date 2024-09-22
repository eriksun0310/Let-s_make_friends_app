import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";
import { Colors } from "../../constants/style";
import type { IsValidItem } from "../../shared/types";

interface CustomTextInputProps {
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  secure?: boolean;
  isValid: IsValidItem;
  label: string;
  value: string;
  setValue: (v: string) => void;
}
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  keyboardType,
  placeholder,
  secure = false,
  isValid,
  label,
  value,
  setValue,
}) => {
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={styles.label}>{label}</Text>

        {isValid?.value && (
          <Text
            style={[
              styles.errorText,
              isValid?.value && { color: Colors.error },
            ]}
          >
            {`(${isValid?.errorText})`}
          </Text>
        )}
      </View>

      <TextInput
        style={[styles.input, isValid?.value && styles.inputInvalid]}
        onChangeText={setValue}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secure}
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
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.button,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  inputInvalid: {
    borderWidth: 2,
    borderColor: Colors.error,
    backgroundColor: Colors.error100,
  },
});
export default CustomTextInput;
