import {
  transformAllUserSettings,
  transformUser,
  transformUserSettings,
} from "../shared/user/userUtils";
import { User, UserSettings } from "../shared/types";
import { supabase } from "./supabaseClient";
import { initUserSettings } from "../shared/static";
import { UserSettingsDBType } from "../shared/dbType";

/*
處理 個人資料 db 操作
users:個人資料
user_selected_option:興趣選項
user_head_shot: 大頭貼
user_online_status: 用戶在線狀態
user_settings: 用戶設定
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
    .select("*", {
      count: "exact",
    })
    .eq("id", userId); // 篩選條件：id 等於 userId

  if (userError) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  // 新用戶
  if (userCount === 0 || !userData || userData.length === 0) {
    return null; // 新用戶或無效的 userId
  }

  // 查詢 user_selected_option
  const { data: selectedData, error: selectedError } = await supabase
    .from("user_selected_option")
    .select("interests, favorite_food, disliked_food", { count: "exact" })
    .eq("user_id", userId); // 篩選條件：id 等於 userId

  if (selectedError) {
    console.error("Error fetching selected data:", selectedError);
    return null;
  }

  // 查詢 user_head_shot
  const { data: headShotData, error: headShotError } = await supabase
    .from("user_head_shot")
    .select("image_url, image_type", { count: "exact" })
    .eq("user_id", userId); // 篩選條件：id 等於 userId

  if (headShotError) {
    console.error("Error fetching headShot data:", headShotError);
    return null;
  }

  const transformedUser = transformUser({
    users: userData[0]!,
    userHeadShot: headShotData[0]! || null,
    userSelectedOption: selectedData[0]! || null,
  });

  return transformedUser;
};

// 點擊 關於我的儲存
export const saveAboutMe = async ({ user }: { user: User }): Promise<void> => {
  try {
    // 儲存自己的基本資料
    await saveUser({ user });

    // 儲存自己的大頭貼
    await saveUserHeadShot({ user });

    // 儲存自己的選項
    await saveUserSelectedOption({ user });

    // 儲存自己的在線狀態
    await updateUserOnlineStatus({ userId: user.userId, isOnline: true });

    // 儲存自己的設定
    await saveUserSettings({ ...initUserSettings, userId: user.userId });
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
}): Promise<void> => {
  try {
    // 驗證 fieldName 是否為允許的欄位
    if (!["name", "introduce"].includes(fieldName)) {
      throw new Error(`Invalid field name: ${fieldName}`);
    }

    const { error } = await supabase
      .from("users")
      .update({
        [fieldName]: fieldValue,
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
export const saveUser = async ({ user }: { user: User }): Promise<void> => {
  try {
    const { error } = await supabase.from("users").upsert(
      {
        id: user.userId,
        name: user.name,
        gender: user.gender,
        introduce: user.introduce,
        birthday: user.birthday,
        email: user.email,
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

// 儲存自己的大頭貼
export const saveUserHeadShot = async ({
  user,
}: {
  user: User;
}): Promise<void> => {
  try {
    const { error } = await supabase.from("user_head_shot").upsert(
      {
        user_id: user.userId,
        image_url: user.headShot.imageUrl,
        image_type: user.headShot.imageType,
      },
      { onConflict: "user_id" } // 衝突鍵為 user_id
    );

    if (error) {
      throw new Error(`Error saving headshot: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user headshot:", error);
  }
};

// 儲存用戶興趣選項
export const saveUserSelectedOption = async ({
  user,
}: {
  user: User;
}): Promise<void> => {
  try {
    const { error } = await supabase.from("user_selected_option").upsert(
      {
        user_id: user.userId,
        interests: user.selectedOption?.interests,
        favorite_food: user.selectedOption?.favoriteFood,
        disliked_food: user.selectedOption?.dislikedFood,
      },
      { onConflict: "user_id" } // 衝突鍵為 user_id
    );

    if (error) {
      throw new Error(`Error saving user options: ${error.message}`);
    }
  } catch (error) {
    console.error("Error saving user options:", error);
  }
};

//檢查用戶是否在線上(2024/12/29 目前用不到, 因為改成 supabase presence)
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
}): Promise<void> => {
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

// 取得用戶設定
export const getUserSettings = async ({
  userId,
}: {
  userId: string;
}): Promise<{
  success: boolean;
  data: UserSettings;
}> => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("user_id, hide_likes, hide_comments, mark_as_read")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.log("取得用戶設定失敗", error);
      return {
        success: false,
        data: {
          ...initUserSettings,
        },
      };
    }

    if (data) {
      const transformedUserSettings = transformUserSettings(data);
      return {
        success: true,
        data: transformedUserSettings,
      };
    } else {
      return {
        success: true,
        data: {
          ...initUserSettings,
        },
      };
    }
  } catch (error) {
    console.log("取得用戶設定失敗", error);

    return {
      success: false,
      data: {
        ...initUserSettings,
      },
    };
  }
};

// 批量查詢所有用戶設定的API
export const getAllUsersSettings = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<{
  success: boolean;
  data: UserSettings[];
}> => {
  try {
    console.log("userIds", userIds);
    const { data, error } = await supabase
      .from("user_settings")
      .select("user_id, hide_likes, hide_comments, mark_as_read")
      .in("user_id", userIds);

    if (error) {
      return {
        success: false,
        data: [],
      };
    }

    console.log("取得所有用戶設定", data);
    const transformedUserSettings = transformAllUserSettings(data);

    return {
      success: true,
      data: transformedUserSettings,
    };
  } catch (error) {
    console.log("取得用戶設定失敗", error);
    return {
      success: false,
      data: [],
    };
  }
};

// 儲存用戶設定
export const saveUserSettings = async ({
  userId,
  hideLikes,
  hideComments,
  markAsRead,
}: {
  userId: string;
  hideLikes: boolean;
  hideComments: boolean;
  markAsRead: boolean;
}): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  try {
    const { error } = await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        hide_likes: hideLikes,
        hide_comments: hideComments,
        mark_as_read: markAsRead,
      },
      { onConflict: "user_id" } // 用來決定 要更新還是插入
    );

    if (error) {
      console.log("更新 user_settings 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新 user_settings 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};
