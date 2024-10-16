import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../util/firebaseConfig";

interface AuthContext {
  token: string;
  initialized: boolean;
  isAuthenticated: boolean;
  authenticatedToken: (token: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  token: "",
  initialized: false,
  isAuthenticated: false, //是否登入
  authenticatedToken: () => {}, //成功登入、註冊
  logout: () => Promise.resolve(), //登出
});

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setInitialized(true);
  });

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
    auth.signOut();
  };

  const value = {
    token: token,
    initialized: initialized,
    isAuthenticated: isAuthenticated,
    authenticatedToken: authenticatedToken,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
