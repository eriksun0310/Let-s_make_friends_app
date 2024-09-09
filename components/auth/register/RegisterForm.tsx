import React, { useState } from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import Button from "../../ui/Button";
import { IsValid } from "./RegisterContent";

export interface Form {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  isValid: IsValid;
  onSubmit: (form: Form) => void;
}

// TODO: getFormValues
const RegisterForm: React.FC<RegisterFormProps> = ({ isValid, onSubmit }) => {
  // 取得輸入資訊,是否有符合規則
  const {
    name: nameIsValid,
    email: emailIsValid,
    password: passwordIsValid,
    confirmPassword: confirmPasswordIsValid,
  } = isValid;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //更新form state
  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <CustomTextInput
        label="名稱"
        value={form.name}
        setValue={(v) => handleChange("name", v)}
        placeholder="請輸入名稱"
        isValid={nameIsValid}
      />
      <CustomTextInput
        label="Email"
        value={form.email}
        setValue={(v) => handleChange("email", v)}
        keyboardType="email-address"
        placeholder="請輸入Email"
        isValid={emailIsValid}
      />

      <CustomTextInput
        label="密碼"
        value={form.password}
        setValue={(v) => handleChange("password", v)}
        placeholder="請輸入密碼"
        secure
        isValid={passwordIsValid}
      />
      <CustomTextInput
        label="確認密碼"
        value={form.confirmPassword}
        setValue={(v) => handleChange("confirmPassword", v)}
        placeholder="請確認密碼"
        secure
        isValid={confirmPasswordIsValid}
      />

      <Button
        text="註冊"
        //TODO: 要驗證DB 輸入的表單規則是否正確
        onPress={() => onSubmit(form)}
      />
    </>
  );
};

export default RegisterForm;
