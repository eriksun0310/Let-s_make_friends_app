import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import {  login } from "../util/auth";
import { AuthContext } from "../store/authContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Text } from "react-native";

export interface LoginForm {
  email: string;
  password: string;
}

interface LoginEmailProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginEmailProps> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCheckMember, setIsCheckMember] = useState({
    value: false,
    errorText: "沒有此會員帳號",
  });

  //處理登入的事件
  // TODO:帳號密碼輸入錯誤的提示
  const loginHandler = async (form: LoginForm) => {
    setLoading(true);
    try {
      const token = await login(form.email, form.password);
      authCtx.authenticatedToken(token);

      // 登入成功,回到首頁
      navigation.replace("main");
    } catch (error) {
      console.log("error", error);
      setError("登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="登入中 ..." />;
  }

  return (
    <>
      {error && <Text>{error}</Text>}
      <LoginContent getValue={loginHandler} isValid={isCheckMember} />
    </>
  );
};

export default Login;
