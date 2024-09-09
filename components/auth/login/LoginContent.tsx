import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import Button from "../../ui/Button";
import FlatButton from "../../ui/FlatButton";
import { useNavigation } from "@react-navigation/native";
import { IsValidItem } from "../register/RegisterContent";

interface LoginContentProps {
  type: "email" | "password";
  getValue: (email: string) => void;
  isValid: IsValidItem;
}

const LoginContent: React.FC<LoginContentProps> = ({
  type,
  getValue,
  isValid,
}) => {
  const navigation = useNavigation();
  const [value, setValue] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {type === "email" ? "歡迎回來" : "Hi! Lin 歡迎回來"}
        </Text>

        {/* login form 拆出去 */}

        <CustomTextInput
          isValid={isValid}
          label={type === "email" ? "信箱" : "密碼"}
          value={value}
          setValue={setValue}
          secure={type === "password"}
        />
        <Button
          text={type === "email" ? "繼續" : "登入"}
          onPress={() => {
            getValue(value);
          }}
        />

        {type === "email" && (
          <FlatButton
            onPress={() => {
              navigation.navigate("register");
            }}
          >
            尚未有會員? 註冊會員
          </FlatButton>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
});

export default LoginContent;
