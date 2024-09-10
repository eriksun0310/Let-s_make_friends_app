import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";
import { Colors } from "../../constants/style";
import { IsValidItem } from "../auth/register/RegisterContent";

interface CustomTextInputProps {
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  secure?: boolean;
  isValid: IsValidItem;
  label: string;
  value: string;
  setValue: (v: string) => void;
}

//TODO: 要加getValue:()=>{}
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  keyboardType,
  placeholder,
  secure = false,
  isValid,
  label,
  value,
  setValue,
}) => {
  // console.log("isValid", isValid);
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
        // autoCapitalize="none"
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
    // marginBottom: 10,
  },
  errorText: {
    fontSize: 15,
    fontWeight: "bold",
    // display:'flex',
    // alignItems:'center'
    // marginBottom: 1,
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
    // backgroundColor: Colors.error,
  },
});
export default CustomTextInput;
