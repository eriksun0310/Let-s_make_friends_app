import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import { login } from "../util/auth";
import { AuthContext } from "../store/authContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Text } from "react-native";
import type { LoginForm, LoginIsValid } from "../shared/types";

interface LoginEmailProps {
  navigation: NavigationProp<any>;
}

interface catchErrorProps {
  errorMessage: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsValid: React.Dispatch<React.SetStateAction<LoginIsValid>>;
}

// 接收錯誤
const catchError = ({
  errorMessage,
  setError,
  setIsValid,
}: catchErrorProps) => {
  if (errorMessage === "INVALID_LOGIN_CREDENTIALS") {
    setIsValid((prev) => ({
      ...prev,
      email: {
        value: true,
        errorText: "信箱或密碼錯誤，請再試一次",
      },
    }));
  } else if (errorMessage === "MISSING_PASSWORD") {
    setIsValid((prev) => ({
      ...prev,
      password: {
        value: true,
        errorText: "請輸入密碼",
      },
    }));
  } else if (errorMessage === "INVALID_EMAIL") {
    setIsValid((prev) => ({
      ...prev,
      email: {
        value: true,
        errorText: "信箱格式錯誤，請確認後再試",
      },
    }));
  } else {
    setError("登入失敗，請稍後再試");
  }
};

const Login: React.FC<LoginEmailProps> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isValid, setIsValid] = useState<LoginIsValid>({
    email: { value: false, errorText: "" },
    password: { value: false, errorText: "" },
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
      const errorMessage = error.error.message as string;

      catchError({
        errorMessage,
        setError,
        setIsValid,
      });
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
      <LoginContent getValue={loginHandler} isValid={isValid} />
    </>
  );
};

export default Login;
