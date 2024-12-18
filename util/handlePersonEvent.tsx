import { User } from "../shared/types";
import { supabase } from "./supabaseClient";

/*
處理 個人資料 db 操作
users:個人資料
user_selected_option:興趣選項
user_head_shot: 大頭貼
user_online_status: 用戶在線狀態
*/

// 取得用戶資料
export const getUserData = async ({
  userId,
}: {
  userId: string;
}): Promise<User | null> => {
  // 查詢主資料表 users
  const {
    data: userData,
    error: userError,
    count: userCount,
  } = await supabase
    .from("users")
    .select("id, name, gender, introduce, birthday, email", {
      count: "exact",
    })
    .eq("id", userId); // 篩選條件：id 等於 userId

  if (userError) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  // 新用戶
  if (userCount === 0) {
    //console.log("新用戶");
    return null;
  }

  // 初始化返回資料
  let responseData: User = {
    userId: userData[0].id,
    name: userData[0].name,
    gender: userData[0].gender,
    introduce: userData[0].introduce,
    birthday: userData[0].birthday,
    email: userData[0].email,
    headShot: {
      imageType: "people",
      imageUrl: "",
    },
    selectedOption: {
      interests: [],
      favoriteFood: [],
      dislikedFood: [],
    },
  };

  // 查詢 user_selected_option
  const { data: selectedData, error: selectedError } = await supabase
    .from("user_selected_option")
    .select("interests, favorite_food, disliked_food", { count: "exact" })
    .eq("user_id", userId); // 篩選條件：id 等於 userId

  if (selectedError) {
    console.error("Error fetching selected data:", selectedError);
  } else if (selectedData.length > 0) {
    responseData = {
      ...responseData,
      selectedOption: {
        interests: selectedData[0].interests,
        favoriteFood: selectedData[0].favorite_food,
        dislikedFood: selectedData[0].disliked_food,
      },
    };
  }

  // 查詢 user_head_shot
  const { data: headShotData, error: headShotError } = await supabase
    .from("user_head_shot")
    .select("image_url, image_type", { count: "exact" })
    .eq("user_id", userId); // 篩選條件：id 等於 userId

  if (headShotError) {
    console.error("Error fetching headShot data:", headShotError);
  } else if (headShotData.length > 0) {
    responseData = {
      ...responseData,
      headShot: {
        imageUrl: headShotData[0].image_url,
        imageType: headShotData[0].image_type,
      },
    };
  }
  // 返回整合的資料
  return responseData;
};

// 點擊 關於我的儲存
export const saveAboutMe = async ({ user }: { user: User }) => {
  try {
    // 儲存自己的基本資料
    await saveUser({ user });

    // 儲存自己的大頭貼
    await saveUserHeadShot({ user });

    // 儲存自己的選項
    await saveUserSelectedOption({ user });

    // 儲存自己的在線狀態
    await updateUserOnlineStatus({ userId: user.userId, isOnline: true });
  } catch (error) {
    console.error("Error updating saveAboutMe:", error);
  }
};

// 更新 個人資料的單一欄位(name、introduce)
export const updateUser = async ({
  userId,
  fieldName,
  fieldValue,
}: {
  userId: string;
  fieldName: "name" | "introduce";
  fieldValue: any;
}) => {
  try {
    // 驗證 fieldName 是否為允許的欄位
    if (!["name", "introduce"].includes(fieldName)) {
      throw new Error(`Invalid field name: ${fieldName}`);
    }

    const { error } = await supabase
      .from("users")
      .update({
        [fieldName]: fieldValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      throw new Error(`Error updating user ${fieldName}: ${error.message}`);
    }
  } catch (error) {
    console.error("updateUser:", error);
  }
};

// 儲存自己的基本資料(for aboutMe 的儲存)
export const saveUser = async ({ user }: { user: User }) => {
  try {
    const { error } = await supabase.from("users").upsert(
      {
        id: user.userId,
        name: user.name,
        gender: user.gender,
        introduce: user.introduce,
        birthday: user.birthday,
        email: user.email,
        updated_at: new Date().toISOString(), // 如果是更新，記錄更新時間
        created_at: new Date().toISOString(), // 如果是插入，記錄建立時間
      },
      { onConflict: "id" } // 指定衝突鍵
    );

    if (error) {
      throw new Error(`Error saving user: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

export const saveUserHeadShot = async ({ user }: { user: User }) => {
  try {
    const { error } = await supabase.from("user_head_shot").upsert(
      {
        user_id: user.userId,
        image_url: user.headShot.imageUrl,
        image_type: user.headShot.imageType,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" } // 衝突鍵為 user_id
    );

    if (error) {
      throw new Error(`Error saving headshot: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user headshot:", error.message);
  }
};

// 儲存用戶興趣選項
export const saveUserSelectedOption = async ({ user }: { user: User }) => {
  try {
    const { error } = await supabase.from("user_selected_option").upsert(
      {
        user_id: user.userId,
        interests: user.selectedOption?.interests,
        favorite_food: user.selectedOption?.favoriteFood,
        disliked_food: user.selectedOption?.dislikedFood,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" } // 衝突鍵為 user_id
    );

    if (error) {
      throw new Error(`Error saving user options: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user options:", error.message);
  }
};

//檢查用戶是否在線上
export const isUserOnline = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_online_status")
    .select("is_online") // 仅选择所需字段
    .eq("user_id", userId)
    .maybeSingle(); // 避免抛出异常

  if (error) {
    console.error("Error checking user online status:", error);
    return false; // 默认返回不在线
  }

  if (!data) {
    console.warn("No record found for user:", userId);
    return false; // 无记录则返回不在线
  }

  return data.is_online; // 返回用户在线状态
};

// 更新用戶在線狀態
export const updateUserOnlineStatus = async ({
  userId,
  isOnline,
}: {
  userId: string;
  isOnline: boolean;
}) => {
  // console.log("updateUserOnlineStatus", userId, isOnline);
  try {
    const { error } = await supabase.from("user_online_status").upsert(
      {
        user_id: userId,
        is_online: isOnline,
        last_seen: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error("Error updating user_online_status:", error);
    }
  } catch (error) {
    console.error("Unexpected error updating user online status:", error);
  }
};
