import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import { login } from "../util/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Text } from "react-native";
import type { LoginForm, LoginIsValid } from "../shared/types";
import { setUser } from "../store/userSlice";
import { getUserData, updateUserOnlineStatus } from "../util/handleUserEvent";
import { useAppDispatch } from "../store/hooks";

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
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isValid, setIsValid] = useState<LoginIsValid>({
    email: { value: false, errorText: "" },
    password: { value: false, errorText: "" },
  });

  //處理登入的事件
  const loginHandler = async (form: LoginForm) => {
    setLoading(true);
    try {
      const { userId, email } = await login(form.email, form.password);

      // 取得用戶資料
      const userData = await getUserData({
        userId,
      });

      // 舊用戶
      if (userData) {
        // 更新用戶在線狀態
        await updateUserOnlineStatus({
          userId: userId,
          isOnline: true,
        });

        dispatch(setUser(userData));
        navigation.navigate("main", { screen: "home" }); // 如果用戶資料完整，跳轉聊天頁面

        // 新用戶
      } else {
        navigation.navigate("aboutMe"); // 如果用戶資料不存在，導航到 aboutMe
      }
    } catch (error) {
      // 捕獲錯誤並處理
      const errorMessage = error.message || "An unexpected error occurred";
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
