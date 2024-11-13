import { User } from "../shared/types";
import { database } from "./firebaseConfig";
import { get, ref, set, update } from "firebase/database";
import { supabase } from "./supabaseClient";

// 取得自己的用戶資料
// export const getUserData = async (userId: string) => {
//   const userRef = ref(database, `users/${userId}`);
//   const snapshot = await get(userRef);
//   if (snapshot.exists()) {
//     return snapshot.val();
//   } else {
//     return null;
//   }
// };

export const getUserData = async (userId: string) => {
  const { data, error, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("userid", userId); // 篩選條件：id 等於 userId



    
  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  if (count === 0) {
    console.log("No user found with the given userId.");
    return null;
  }

  if (count > 1) {
    console.log("Multiple users found with the given userId.");
    return null;
  }

  console.log("User Data:", data); // 印出用戶資料
  return data[0]; // 只有一筆資料時返回
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
