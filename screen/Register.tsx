import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { NavigationProp, useNavigation } from "@react-navigation/native";

import CustomTextInput from "../components/ui/CustomTextInput";
import RegisterForm, { Form } from "../components/auth/RegisterForm";
import RegisterContent from "../components/auth/RegisterContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";

export interface IsValidItem {
  value: boolean;
  errorText: string;
}

export interface IsValid {
  name: IsValidItem;
  email: IsValidItem;
  password: IsValidItem;
  confirmPassword: IsValidItem;
}

interface RegisterProps {
  navigation: NavigationProp<any>;
}

const initIsValid = {
  name: { value: false, errorText: "" },
  email: { value: false, errorText: "" },
  password: { value: false, errorText: "" },
  confirmPassword: { value: false, errorText: "" },
};

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  //
  const [isLoading, setLoading] = useState(false);
  // 檢查輸入資訊,是否有符合規則
  // const [isValid, setIsValid] = useState<IsValid>(initIsValid);

  // const submitHandle = (form: Form) => {
  //   let { name, email, password, confirmPassword } = form;

  //   email = email.trim();
  //   password = password.trim();
  //   const nameIsValid = name.length > 0;
  //   const emailIsValid = email.includes("@");
  //   // 密碼6-8位
  //   const passwordIsValid = password.length >= 6 && password.length <= 8;
  //   const confirmPasswordIsValid =
  //     confirmPassword === password &&
  //     password.length >= 6 &&
  //     password.length <= 8;

  //   //驗證表單規則
  //   if (
  //     !nameIsValid ||
  //     !emailIsValid ||
  //     !passwordIsValid ||
  //     !confirmPasswordIsValid
  //   ) {
  //     setIsValid({
  //       name: { value: !nameIsValid, errorText: "請輸入名稱" },
  //       email: { value: !emailIsValid, errorText: "請輸入信箱正確的格式" },
  //       password: { value: !passwordIsValid, errorText: "密碼需至少六位數" },
  //       confirmPassword: {
  //         value: !confirmPasswordIsValid,
  //         errorText: "輸入密碼不一致",
  //       },
  //     });
  //   } else {
  //     setIsValid(initIsValid);
  //   }

  //   // 回到會員登入
  //   // navigation.replace("loginEmail");
  // };

  // 註冊
  const signUpHandler = async (form: Form) => {
    setLoading(true);

    await createUser(form);
    setLoading(false);

    // 回到會員登入
    // navigation.replace("loginEmail");
  };

  if (isLoading) {
    return <LoadingOverlay message="註冊中 ..." />;
  }

  return <RegisterContent getFormValue={signUpHandler} />;
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

export default Register;
