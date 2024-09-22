import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { child } from "firebase/database";

interface AuthContext {
  token: string;
  isAuthenticated: boolean;
  authenticatedToken: (token: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  token: "",
  isAuthenticated: false, //是否登入
  authenticatedToken: () => {}, //成功登入、註冊
  logout: () => Promise.resolve(), //登出
});

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");

  //設置認證過的token
  const authenticatedToken = async (token: string) => {
    setToken(token);
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
    }
  };

  //登出
  const logout = async (): Promise<void> => {
    setToken("");
    await AsyncStorage.removeItem("token");
    return Promise.resolve();
  };

  const value = {
    token: token,
    isAuthenticated: !!token,
    authenticatedToken: authenticatedToken,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
