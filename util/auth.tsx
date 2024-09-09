import axios from "axios";
import { Form } from "../components/auth/RegisterForm";
// import firebase, { initializeApp } from 'firebase/app';
import 'firebase/database';
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

// // 初始化 Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const firebaseConfig = {
//   apiKey: '<API_KEY>',
//   authDomain: '<AUTH_DOMAIN>',
//   databaseURL: '<DATABASE_URL>',
//   projectId: '<PROJECT_ID>',
//   storageBucket: '<STORAGE_BUCKET>',
//   messagingSenderId: '<MESSAGING_SENDER_ID>',
// };

// firebase.initializeApp(firebaseConfig);

const API_KEY = process.env.FIREBASE_BASE_API_KEY;

// 會員註冊
export const createUser = async (form: Form) => {
  const response = await axios.post(
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
    {
      email: form.email,
      password: form.password,
      returnSecureToken: true,
    }
  );
  //   console.log("response", response);

  //從response取得 獲取註冊用戶ID
  const userId = response.data.localId;

  // 將用戶資料存入 Realtime Database
  // await set(ref(database, "users/" + userId), {
  //   name: form.name,
  //   email: form.email,
  //   userId: userId,
  // });
};
