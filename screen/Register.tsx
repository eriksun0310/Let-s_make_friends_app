import React, { useContext, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Text } from "react-native";
import RegisterContent from "../components/auth/register/RegisterContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import { AuthContext } from "../store/authContext";
import type { Form } from "../shared/types";

interface RegisterProps {
  navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 註冊
  const signUpHandler = async (form: Form) => {
    setLoading(true);
    try {
      const token = await createUser(form.email, form.password);

      // console.log("token  signUpHandler ", token);
      authCtx.authenticatedToken(token);

      // 註冊成功後回到登入頁面
      navigation.replace("login");
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
