import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../util/firebaseConfig";

interface AuthContext {
  userId: string;
  initialized: boolean;
  isAuthenticated: boolean;
  authenticatedUserId: (userId: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  userId: "",
  initialized: false,
  isAuthenticated: false, //是否登入
  authenticatedUserId: () => {}, //成功登入、註冊
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
  const [userId, setUserId] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setInitialized(true);
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // setUserId(user.uid); // 設定使用者 ID
        setIsAuthenticated(true);
      } else {
        // setUserId("");
        setIsAuthenticated(false);
      }

      setInitialized(true); // 初始化完成
    });

    return () => unsubscribe();
  }, []);

  // 設置認證過的用戶ID
  const authenticatedUserId = async (userId: string) => {
    setUserId(userId);
    // TODO: 20241019 先關 不知道要幹嘛的
    // try {
    //   await AsyncStorage.setItem("userId", userId);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  //登出
  const logout = async (): Promise<void> => {
    auth.signOut();
  };

  const value = {
    userId: userId,
    initialized: initialized,
    isAuthenticated: isAuthenticated,
    authenticatedUserId: authenticatedUserId,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
