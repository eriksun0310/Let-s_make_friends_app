import {
  transformAllUserSettings,
  transformUser,
  transformUserSettings,
} from "../shared/user/userUtils";
import { Result, User, UserSettings } from "../shared/types";
import { supabase } from "./supabaseClient";
import { initUserSettings } from "../shared/static";
import { UserHeadShotDBType, UserSelectedOptionDBType } from "../shared/dbType";

/*
☑️: 已經整理好的
處理 個人資料 db 操作
users:個人資料
user_selected_option:興趣選項
user_head_shot: 大頭貼
user_settings: 用戶設定
*/

// ☑️取得用戶資料
// export const getUserDetail = async ({
//   userId,
// }: {
//   userId: string;
// }): Promise<GetUserDataReturn> => {
//   try {
//     // 查詢主資料表 users
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", userId); // 篩選條件：id 等於 userId

//     if (userError) {
//       console.error("取得用戶資料 失敗:", userError);
//       return {
//         success: false,
//         errorMessage: userError.message,
//         data: null,
//       };
//     }

//     // 新用戶
//     if (!userData || userData.length === 0) {
//       return {
//         success: true,
//         data: null,
//       };
//     }

//     // 查詢 user_selected_option
//     const { data: selectedData, error: selectedError } = await supabase
//       .from("user_selected_option")
//       .select("interests, favorite_food, disliked_food", { count: "exact" })
//       .eq("user_id", userId); // 篩選條件：id 等於 userId

//     if (selectedError) {
//       console.error("取得用戶喜好 失敗:", selectedError);
//       return {
//         success: false,
//         errorMessage: selectedError.message,
//         data: null,
//       };
//     }

//     // 查詢 user_head_shot
//     const { data: headShotData, error: headShotError } = await supabase
//       .from("user_head_shot")
//       .select("image_url, image_type")
//       .eq("user_id", userId); // 篩選條件：id 等於 userId

//     if (headShotError) {
//       console.error("取得用戶大頭貼 失敗:", headShotError);
//       return {
//         success: false,
//         errorMessage: headShotError.message,
//         data: null,
//       };
//     }

//     const transformedUser = transformUser({
//       users: userData[0],
//       userHeadShot: headShotData[0] || null,
//       userSelectedOption: selectedData[0] || null,
//     });

//     return {
//       success: true,
//       data: transformedUser,
//     };
//   } catch (error) {
//     console.log("取得用戶資料 失敗", error);
//     return {
//       success: false,
//       errorMessage: (error as Error).message,
//       data: null,
//     };
//   }
// };

type GetUserDataReturn = Result & {
  data: User | null;
};
// ☑️取得用戶詳細資料
export const getUserDetail = async ({
  userId,
}: {
  userId: string;
}): Promise<GetUserDataReturn> => {
  try {
    // 查詢 users, 並包含關聯的子表資料
    const { data, error } = await supabase
      .from("users")
      .select(
        `
       id, 
       name, 
       gender, 
       introduce, 
       birthday, 
       email, 
       created_at, 
       updated_at,
       user_head_shot(image_url, image_type),
       user_selected_option(interests, favorite_food, disliked_food)
       `
      )
      .eq("id", userId)
      .single(); // 確保只有一筆記錄

    // 如果查詢發生錯誤，返回錯誤信息
    if (error) {
      // 如果查無資料，Supabase 通常返回錯誤訊息包含 "No rows"
      if (error.message.includes("No rows")) {
        return {
          success: true,
          data: null, // 新會員
        };
      }

      // 如果是其他錯誤, 返回錯誤信息
      console.error("取得用戶資料失敗:", error);
      return {
        success: false,
        errorMessage: error.message,
        data: null,
      };
    }
    // 如果查有資料，進行資料轉換
    const transformedUser = transformUser({
      users: data,
      userHeadShot: (data.user_head_shot as any) ?? null,
      userSelectedOption: (data.user_selected_option as any) ?? null,
    });

    return {
      success: true,
      data: transformedUser,
    };
  } catch (error) {
    console.log("取得用戶資料 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

type GetUsersDetailReturn = Result & {
  data: User[];
};

// ☑️批量查詢所有用戶的詳細資料
export const getUsersDetail = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<GetUsersDetailReturn> => {
  try {
    // 查詢 users
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id, 
        name, 
        gender, 
        introduce, 
        birthday, 
        email, 
        created_at, 
        updated_at,
        user_head_shot(image_url, image_type),
        user_selected_option(interests, favorite_food, disliked_food)
        `
      )
      .in("id", userIds);

    if (error) {
      console.error("批量查詢所有用戶失敗", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const transformedUsers = data.map((user) =>
      transformUser({
        users: user,
        userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
        userSelectedOption:
          user.user_selected_option as unknown as UserSelectedOptionDBType,
      })
    );

    return {
      success: true,
      data: transformedUsers,
    };
  } catch (error) {
    console.log("批量查詢所有用戶錯誤", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

//☑️ 點擊 關於我的儲存
export const saveAboutMe = async ({ user }: { user: User }): Promise<void> => {
  try {
    // 儲存自己的基本資料
    await saveUser({ user });

    // 儲存自己的大頭貼
    await saveUserHeadShot({ user });

    // 儲存自己的選項
    await saveUserSelectedOption({ user });

    // 儲存自己的設定
    await saveUserSettings({ ...initUserSettings, userId: user.userId });
  } catch (error) {
    console.error("Error updating saveAboutMe:", error);
  }
};

// ☑️更新 個人資料的單一欄位(name、introduce)
export const updateUserField = async ({
  userId,
  fieldName,
  fieldValue,
}: {
  userId: string;
  fieldName: "name" | "introduce";
  fieldValue: any;
}): Promise<Result> => {
  try {
    // 驗證 fieldName 是否為允許的欄位
    if (!["name", "introduce"].includes(fieldName)) {
      return {
        success: false,
        errorMessage: `更新不允許的欄位: ${fieldName}`,
      };
    }

    const { error } = await supabase
      .from("users")
      .update({
        [fieldName]: fieldValue,
      })
      .eq("id", userId);

    if (error) {
      console.log(`更新 users 的${fieldName} 失敗`, error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️儲存自己的基本資料(for aboutMe 的儲存)
export const saveUser = async ({ user }: { user: User }): Promise<Result> => {
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
      console.log("更新 users 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新 users 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️儲存自己的大頭貼
export const saveUserHeadShot = async ({
  user,
}: {
  user: User;
}): Promise<Result> => {
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
      console.log("更新 user_head_shot 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新 user_head_shot 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

// ☑️儲存用戶興趣選項
export const saveUserSelectedOption = async ({
  user,
}: {
  user: User;
}): Promise<Result> => {
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
      console.log("更新 user_selected_option 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("更新 user_selected_option 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type GetUserSettingsReturn = Result & {
  data: UserSettings;
};

// ☑️取得個別用戶設定
export const getUserSettings = async ({
  userId,
}: {
  userId: string;
}): Promise<GetUserSettingsReturn> => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("user_id, hide_likes, hide_comments, mark_as_read")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.log("取得 user_settings 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
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
    console.log("取得 user_settings 失敗", error);

    return {
      success: false,
      errorMessage: (error as Error).message,
      data: {
        ...initUserSettings,
      },
    };
  }
};

type GetAllUsersSettingsReturn = Result & {
  data: UserSettings[];
};

// ☑️批量查詢所有用戶設定
export const getAllUsersSettings = async ({
  userIds,
}: {
  userIds: string[];
}): Promise<GetAllUsersSettingsReturn> => {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("user_id, hide_likes, hide_comments, mark_as_read")
      .in("user_id", userIds);

    if (error) {
      console.log("取得 所有 user_settings", error);
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }
    const transformedUserSettings = transformAllUserSettings(data);

    return {
      success: true,
      data: transformedUserSettings,
    };
  } catch (error) {
    console.log("取得 所有 user_settings", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

// ☑️儲存用戶設定
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
}): Promise<Result> => {
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
