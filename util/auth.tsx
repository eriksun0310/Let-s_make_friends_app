import axios from "axios";
// import { initializeApp } from "firebase/app";
// import firebase from "firebase/app";
// import "firebase/database";

// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, auth, database } from "./firebaseConfig";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATABASEURL,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.MESSAGINGSENDERID,
// };
export const firebaseConfig = {
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

// authenticate:專門處理和firebase 的認證API 對接工作
export const authenticate = async (
  mode: "signUp" | "signInWithPassword",
  email: string,
  password: string
) => {
  try {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
    return response;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// 會員註冊
export const createUser = async (email: string, password: string) => {
  try {
    const response = await authenticate("signUp", email, password);
    const token = response.data.idToken;
    return token;
  } catch (error) {
    error;
  }
};

//login:具體的接口,專門處理會員登入的邏輯
export const login = async (email: string, password: string) => {
  // const response = await authenticate("signInWithPassword", email, password);

  // // console.log('response', response)

  // const token = response.data.idToken;
  // const userId = response.data.localId;

  // console.log("login userId", userId);

  // return {
  //   token,
  //   userId,
  // };

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();

  // userCredential.user.email

  return {
    token: token,
    userId: userCredential.user.uid,
  };
};

// 目前用不到
const verifyToken = async (token) => {
  console.log("token", token);
  console.log("API_KEY", API_KEY);
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/tokeninfo?key=${API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({ idToken: token }),
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("response", response);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Invalid token:", errorData);
    return null;
  }

  return await response.json(); // 返回 token 的內容
};

// 儲存會員資料
export const saveUserData = async (user: any, token: string) => {
  set(ref(database, "users/" + user.id), {
    ...user,
  });

  // console.log("user  auth", user);
  // try {
  //   const url = `https://let-s-make-friends-app-default-rtdb.firebaseio.com/users/${user.userId}.json`;

  //   await axios.put(url, user);

  //   // TODO: 20241010 先暫時寫入的時候 不用用auth
  //   //   const response = await axios.put(url, user,
  //   //     {
  //   //     headers: {
  //   //       Authorization: `Bearer ${token}`,
  //   //     },
  //   //   }
  //   // );
  //   console.log("save user success, response ");
  // } catch (error) {
  //   console.log("error save user", error);
  // }
};
