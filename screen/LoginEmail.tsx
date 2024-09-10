import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import LoginContent from "../components/auth/login/LoginContent";
import { checkEmail } from "../util/auth";

interface LoginEmailProps {
  navigation: NavigationProp<any>;
}

const LoginEmail: React.FC<LoginEmailProps> = ({ navigation }) => {
  const [isCheckMember, setIsCheckMember] = useState({
    value: false,
    errorText: "沒有此會員帳號",
  });

  //檢查是否有會員
  const checkMember = async (email: string) => {
    const memberName = await checkEmail(email);

    console.log("memberName", memberName);

    // TODO: 用email 要去DB 確認有無會員,如果沒有的話,value 會是true
    // if (!email) {
    //   setIsCheckMember((prev) => ({
    //     ...prev,
    //     value: true,
    //   }));
    //   // 有會員
    // } else {
    //   setIsCheckMember((prev) => ({
    //     ...prev,
    //     value: false,
    //   }));
    //   // 登入密碼頁面
    //   navigation.navigate("loginPassword");
    // }
  };

  return (
    <LoginContent type="email" getValue={checkMember} isValid={isCheckMember} />
  );
};

export default LoginEmail;
