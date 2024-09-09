import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import RegisterContent from "../components/auth/register/RegisterContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { createUser } from "../util/auth";
import { Form } from "../components/auth/register/RegisterForm";


interface RegisterProps {
  navigation: NavigationProp<any>;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);

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

export default Register;
