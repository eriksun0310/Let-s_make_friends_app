import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";

interface LoginEmailProps {
  navigation: NavigationProp<any>;
}
// TODO: 到時候要從DB 帶入名稱
const LoginPassword: React.FC<LoginEmailProps> = ({ navigation }) => {
  const [isCheckPassword, setIsCheckPassword] = useState({
    value: false,
    errorText: "會員密碼錯誤",
  });
  const confirmPassword = (password: string) => {
    // TODO: 用password 去DB 確認會員密碼是否正確,如果不正確,value 會是true

    if (!password) {
      setIsCheckPassword((prev) => ({
        ...prev,
        value: true,
      }));
    } else {
      setIsCheckPassword((prev) => ({
        ...prev,
        value: false,
      }));
      // 登入主頁面
      navigation.navigate("main");
    }
  };

  return (
    <LoginContent
      type="password"
      getValue={confirmPassword}
      isValid={isCheckPassword}
    />
  );
};

export default LoginPassword;
