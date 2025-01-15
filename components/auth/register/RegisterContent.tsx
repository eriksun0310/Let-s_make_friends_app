import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import RegisterForm from "./RegisterForm";
import type { Form, RegisterIsValid } from "../../../shared/types";
import FlatButton from "../../ui/button/FlatButton";
import { useAppDispatch } from "../../../store/hooks";

const initIsValid = {
  email: { value: false, errorText: "" },
  password: { value: false, errorText: "" },
  confirmPassword: { value: false, errorText: "" },
};
interface RegisterContentProps {
  getFormValue: (form: Form) => void;
}

const RegisterContent: React.FC<RegisterContentProps> = ({ getFormValue }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  // 檢查輸入資訊,是否有符合規則
  const [isValid, setIsValid] = useState<RegisterIsValid>(initIsValid);

  const submitHandle = (form: Form) => {
    let { email, password, confirmPassword } = form;

    email = email.trim();
    password = password.trim();
    const emailIsValid = email.includes("@");
    // 密碼6-8位
    const passwordIsValid = password.length >= 6 && password.length <= 8;
    const confirmPasswordIsValid =
      confirmPassword === password &&
      password.length >= 6 &&
      password.length <= 8;

    //驗證表單規則
    if (!emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
      setIsValid({
        email: { value: !emailIsValid, errorText: "請輸入信箱正確的格式" },
        password: { value: !passwordIsValid, errorText: "密碼需至少六位數" },
        confirmPassword: {
          value: !confirmPasswordIsValid,
          errorText: "輸入密碼不一致",
        },
      });
    } else {
      setIsValid(initIsValid);
      getFormValue(form);
    }
  };

  // 回到登入頁面
  const backToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>會員註冊</Text>

          <RegisterForm isValid={isValid} onSubmit={submitHandle} />
          <FlatButton onPress={backToLogin}>已有會員? 會員登入</FlatButton>
        </View>
      </SafeAreaView>
    </>
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

export default RegisterContent;
