import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import { login } from "../util/auth";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Text } from "react-native";
import type { LoginForm, LoginIsValid } from "../shared/types";
import { database } from "../util/firebaseConfig";
import { ref, get } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

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
  const dispatch = useDispatch();

  // const authCtx = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isValid, setIsValid] = useState<LoginIsValid>({
    email: { value: false, errorText: "" },
    password: { value: false, errorText: "" },
  });

  //
  const checkIfUserExist = async (userId: string) => {
    const userRef = ref(database, `users/${userId}`);

    try {
      const snapshot = await get(userRef);
      return snapshot.exists();
    } catch (error) {
      console.log("error");
      return false;
    }
  };

  //處理登入的事件
  const loginHandler = async (form: LoginForm) => {
    setLoading(true);
    try {
      const { userId } = await login(form.email, form.password);

      const userExists = await checkIfUserExist(userId);

      //儲存 會員ID
      dispatch(
        setUser({
          userId: userId,
          email: form.email,
        })
      );

      // authCtx.authenticatedUserId(userId);
      if (userExists) {
        navigation.replace("main");
      } else {
        navigation.replace("aboutMe");
      }
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
