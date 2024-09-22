import React, { useContext, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import { login } from "../util/auth";
import { AuthContext } from "../store/authContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Text, Alert } from "react-native";
import type { LoginForm, LoginIsValid } from "../shared/types";
import { database, auth } from "../util/firebaseConfig";
import { ref, set, get } from "firebase/database";
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

// 檢查缺少的欄位
const checkForMissingFields = (userData) => {
  const requiredFields = ["name", "address"]; // 假設需要這些欄位
  return requiredFields.filter((field) => !userData[field]);
};

const showAlert = (title, message) => {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      {
        text: "否",
        onPress: () => resolve(false), // 點擊"否"的時候返回 false
        style: "cancel",
      },
      {
        text: "是",
        onPress: () => resolve(true), // 點擊"是"的時候返回 true
      },
    ]);
  });
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
      const { token, userId } = await login(form.email, form.password);
      authCtx.authenticatedToken(token);

      // if (!userId) {
      //   throw new Error("未能獲取用戶ID");
      // }
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      // TODO：userData 檢查是否有

      console.log("userData", userData);

      if (!userData) {
        throw new Error("未能獲取用戶資料");
      }

   

      // 檢查必要欄位是否填寫
      const missingFields = checkForMissingFields(userData);

      if (missingFields.length > 0) {
        const shouldUpdate = await showAlert(
          "缺少資料",
          `有未填寫的欄位：${missingFields.join(", ")}。是否要前往填寫？`
        );
        if (shouldUpdate) {
          navigation.replace("editPersonal");
        } else {
          navigation.replace("main");
        }
      } else if (userData.isNewMember) {
        navigation.replace("moreAboutMe");
      } else {
        navigation.replace("main");
      }

      // // 登入成功,回到首頁
      // navigation.replace("main");
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
