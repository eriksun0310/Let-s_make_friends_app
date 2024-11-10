import { User } from "../shared/types";
import { database } from "./firebaseConfig";
import { get, ref, set, update } from "firebase/database";

// 取得自己的用戶資料
export const getUserData = async (userId: string) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

// 儲存自己的基本資料
export const saveUserData = async (user: User) => {
  await set(ref(database, `users/${user.userId}`), {
    ...user,
  });
};



// 編輯自己的資料(for:單一欄位)
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

    await update(ref(database, `users/${userId}`), updates);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};
