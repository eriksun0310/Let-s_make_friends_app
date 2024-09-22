import axios from "axios";
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASEURL,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID,
// };

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};

const API_KEY = process.env.API_KEY;
// // 初始化 Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// 驗證身分
export const authenticate = async (
  mode: "signUp" | "signInWithPassword",
  email: string,
  password: string
) => {
  console.log("API_KEY", API_KEY);
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });
  return response;
};

// 會員註冊
export const createUser = async (email: string, password: string) => {
  try {
    const response = await authenticate("signUp", email, password);
    const token = response.data.idToken;
    return token;
  } catch (error) {
    console.log(error);
  }
};

//會員登入
export const login = async (email: string, password: string) => {
  const response = await authenticate("signInWithPassword", email, password);
  const token = response.data.idToken;

  return token;
};
