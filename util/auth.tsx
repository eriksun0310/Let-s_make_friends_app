import { auth, database } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { get, ref, set, update } from "firebase/database";
import { User } from "../shared/types";

export const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};

const API_KEY = process.env.API_KEY;

// 會員註冊
export const createUser = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
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

// 取得用戶資料
export const getUserData = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

// 儲存用戶資料
export const saveUserData = async (user: User) => {
  console.log("saveUserData   user", user);
  set(ref(database, "users/" + user.userId), {
    ...user,
  });
};

// 編輯用戶資料(for:單一欄位)
export const editUserData = async ({
  userId,
  fieldName,
  fieldValue,
}: {
  userId: string;
  fieldName: string;
  fieldValue: any;
}) => {
  try {
    const updates: Record<string, any> = {};
    updates[fieldName] = fieldValue;

    console.log("updates", updates);

    await update(ref(database, "users/" + userId), updates);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};
