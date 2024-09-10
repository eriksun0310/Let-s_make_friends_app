import axios from "axios";
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import "firebase/database";
import { Form } from "../components/auth/register/RegisterForm";
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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 驗證身分
export const authenticate = async (
  mode: "signUp" | "signInWithPassword",
  form: Form
) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(url, {
    email: form.email,
    password: form.password,
    returnSecureToken: true,
  });

  return response;
};

// 會員註冊
// export const createUser = async (form: Form) => {
//   console.log(111111);
//   const response = await authenticate("signUp", form);
//   //從response取得 獲取註冊用戶ID
//   const userId = response.data.localId;

//   const token = response.data.idToken;
//   console.log("token 1111", token);

//   // 將用戶資料存入 Realtime Database
//   await set(
//     ref(database, "users/" + userId),
//     {
//       name: form.name,
//       email: form.email,
//       userId: userId,
//     },
//     {
//       // 使用身份驗證令牌（ID Token）來驗證用戶身份
//       auth: token,
//     }
//   );
//   console.log("token 22222", token);

//\
// };

export const createUser = async (form: Form) => {
  try {
    const response = await authenticate("signUp", form);
    //從response取得 獲取註冊用戶ID
    const userId = response.data.localId;

    const token = response.data.idToken;
    console.log("token 1111", token);

    // firebase.database().ref("users").push(
    //   {
    //     name: form.name,
    //     email: form.email,
    //     userId: userId,
    //   },
    //   {
    //     auth: token,
    //   }
    // );

    // 將用戶資料存入 Realtime Database
    await set(ref(database, "users/" + userId), {
      name: form.name,
      email: form.email,
      userId: userId,
    });

    console.log("token 22222", token);

    return token;
  } catch (error) {
    console.log(error);
  }
};

//會員登入
export const login = (form: Form) => {
  const response = authenticate("signInWithPassword", form);
  const token = response.data.idToken;
  console.log("token 44444", token);
  return token;
  // return authenticate("signInWithPassword", form);
};

//檢查會員信箱是否已註冊
export const checkEmail = async (email: string) => {
  console.log("email", email);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("user", user);
      const idToken = await user.getIdToken();
      const db = firebase.database();
      const ref = db
        .ref("users")
        .orderByChild("email")
        .equalTo(email)
        .auth(idToken);
      const snapshot = await ref.once("value");
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const name = userData.name;
        console.log("name", name);
        return name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  });
};

// 會員註冊
// export const createUser = async (form: Form) => {
//   try {
//     // 註冊Firebase 的Authentication 服務中
//     const response = await axios.post(
//       "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
//         firebaseConfig.apiKey,
//       {
//         email: form.email,
//         password: form.password,
//         returnSecureToken: true,
//       }
//     );
//     //   console.log("response", response);

//     //從response取得 獲取註冊用戶ID
//     const userId = response.data.localId;

//     // 將用戶資料存入 Realtime Database
//     await set(ref(database, "users/" + userId), {
//       name: form.name,
//       email: form.email,
//       userId: userId,
//     });
//   } catch (error) {
//     console.log("error", error);
//     throw new Error("User creation failed");
//   }
// };
