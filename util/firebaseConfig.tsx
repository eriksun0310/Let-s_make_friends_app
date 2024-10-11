import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // 使用 initializeAuth
import AsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 獲取資料庫實例
const database = getDatabase(app);

// 使用 AsyncStorage 進行持久化
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage), // 確保這裡使用正確的 AsyncStorage
// });

export { app, database };
