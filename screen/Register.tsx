import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { Text } from "react-native";
import RegisterContent from "../components/auth/register/RegisterContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import type { Form } from "../shared/types";

interface RegisterProps {
  navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 註冊
  const signUpHandler = async (form: Form) => {
    setLoading(true);
    try {
      await createUser(form.email, form.password);

      // 註冊成功後回到登入頁面
      navigation.navigate("login");
    } catch (error) {
      console.log("error", error);
      setError("註冊失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="註冊中 ..." />;
  }

  return (
    <>
      {error && <Text>{error}</Text>}
      <RegisterContent getFormValue={signUpHandler} />
    </>
  );
};

export default Register;
