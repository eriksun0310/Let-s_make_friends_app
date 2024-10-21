import axios from "axios";
import { app, auth, database } from "./firebaseConfig";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";

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
// export const authenticate = async (
//   mode: "signUp" | "signInWithPassword",
//   email: string,
//   password: string
// ) => {
//   try {
//     const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
//     const response = await axios.post(url, {
//       email: email,
//       password: password,
//       returnSecureToken: true,
//     });
//     return response;
//   } catch (error) {
//     throw error.response ? error.response.data : error;
//   }
// };

// 會員註冊
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;
    return userId;
  } catch (error) {
    error;
  }
};

//login:具體的接口,專門處理會員登入的邏輯
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return {
    userId: userCredential.user.uid,
  };
};

// 儲存會員資料
export const saveUserData = async (user: any) => {
  console.log('user', user)
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
