import { auth, database } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { child, get, push, ref, set, update } from "firebase/database";
import { User } from "../shared/types";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { supabase } from "./supabaseClient";

// 會員註冊
export const createUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("error createUser", error);
    if (error) throw error;

    // return data; // 成功後會返回使用者的註冊資料
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
};

// 會員登入
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    console.log("data login", data);
    console.log("data user", data.user.id);
    return {
      userId: data.user.id,
      email: data.user.email,
    };
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// 儲存用戶貼文資料，為每篇貼文建立唯一 ID
//TODO: 首頁  + PostData type
export const savePostData = async (userId: string, postData) => {
  const newPostRef = push(ref(database, `${userId}/post`)); // 產生唯一ID
  await set(newPostRef, {
    ...postData,
    timestamp: new Date().toISOString(), // 加入時間戳
  });
};

// TODO: 首頁 發文有包含圖片的話,要上傳到 firebase storage
// 假設 `file` 是用戶上傳的圖片檔案
export const uploadPostWithMedia = async (
  userId: string,
  postData: PostData,
  files: File[]
) => {
  const mediaUrls: string[] = [];

  // 上傳每個檔案到 Firebase Storage
  for (const file of files) {
    const fileRef = storageRef(storage, `posts/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    mediaUrls.push(url); // 將取得的 URL 儲存到 mediaUrls 陣列
  }

  // 儲存貼文資料，包含 mediaUrls
  const newPostRef = push(ref(database, `${userId}/post`));
  await set(newPostRef, {
    ...postData,
    media: mediaUrls, // 將 mediaUrls 陣列儲存到貼文
    timestamp: new Date().toISOString(),
  });
};
