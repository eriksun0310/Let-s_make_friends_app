import { auth, database } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { get, push, ref, set, update } from "firebase/database";
import { User } from "../shared/types";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";


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
  const userRef = ref(database, `${userId}/user`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

// 儲存用戶基本資料
export const saveUserData = async (user: User) => {
  set(ref(database, `${user.userId}/user`), {
    ...user,
  });
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

    await update(ref(database, `${userId}/user`), updates);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};
