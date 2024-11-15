import {  User } from "../shared/types";
import { supabase } from "./supabaseClient";



export const getUserData = async ({ userId }: { userId: string }) => {
  const { data, error, count } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("userid", userId); // 篩選條件：id 等於 userId
  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
  console.log("count", count);
  console.log("data", data);
  // 新用戶
  if (count === 0) {
    console.log("new user");

    if (error) {
      console.error("Error inserting user data:", error);
      return null;
    }

    // console.log('insertData', insertData)

    return null;
  }

  console.log("data", data);
  return data[0]; // 只有一筆資料時返回
};


// ----------------------從下面開始------------------------------------------

// 更新 users 單一欄位(introduce、name) updateUser()
// 儲存 users 表 saveUser()
// 儲存 user_head_shot saveUserHeadShot()
// 儲存 user_selected_option saveUserSelectedOption()

// 點擊 關於我的儲存
export const saveAboutMe = async ({ user }: { user: User }) => {
  try {
    await saveUser({ user });
    console.log("User data saved successfully.");

    await saveUserHeadShot({ user });
    console.log("User headshot saved successfully.");

    await saveUserSelectedOption({ user });
    console.log("User selected options saved successfully.");
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
      .eq("userid", userId);

    // let result;
    // // if (["name", "introduce"].includes(fieldName)) {
    // //   console.log("introduce fieldValue", fieldValue);
    // // 更新基本用戶資料
    // result = await supabase
    //   .from("users")
    //   .update({
    //     [fieldName]: fieldValue,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("userid", userId);
    // // }

    // // 檢查更新結果
    // if (result.error) {
    //   throw result.error;
    // }

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
    const { error, count } = await supabase
      .from("users")
      .select("userid", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
      .eq("userid", user.userId); // 篩選條件：id 等於 userId

    if (error) {
      console.error("Error checking existing users:", error);
    }

    const updateOrInsert =
      count > 0
        ? supabase
            .from("users")
            .update({
              name: user.name,
              gender: user.gender,
              introduce: user.introduce,
              birthday: user.birthday,
              email: user.email,
              updated_at: new Date().toISOString(),
            })
            .eq("userid", user.userId)
        : supabase.from("users").insert({
            userid: user.userId,
            name: user.name,
            gender: user.gender,
            introduce: user.introduce,
            birthday: user.birthday,
            email: user.email,
            created_at: new Date().toISOString(),
          });

    // let result;
    // if (count > 0) {
    //   // 如果 興趣選項 已經存在，執行更新
    //   result = await supabase
    //     .from("users")
    //     .update({
    //       name: user.name,
    //       gender: user.gender,
    //       introduce: user.introduce,
    //       birthday: user.birthday,
    //       email: user.email,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("user_id", user.userId);
    // } else {
    //   // 如果 user 不存在，執行插入
    //   result = await supabase.from("users").insert({
    //     name: user.name,
    //     gender: user.gender,
    //     introduce: user.introduce,
    //     birthday: user.birthday,
    //     email: user.email,
    //     created_at: new Date().toISOString(),
    //   });
    // }
    // 檢查更新結果
    // if (result.error) {
    //   throw result.error;
    // }

    const { error: updateError } = await updateOrInsert;

    if (updateError) {
      throw new Error(`Error saving users: ${updateError.message}`);
    }
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

// 儲存用戶大頭貼
export const saveUserHeadShot = async ({ user }: { user: User }) => {
  try {
    const { error, count } = await supabase
      .from("user_head_shot")
      .select("user_id", { count: "exact" })
      .eq("user_id", user.userId);

    if (error) {
      console.error("Error checking existing headshot:", error.message);
    }

    console.log("count head shot", count);

    const updateOrInsert =
      count > 0
        ? supabase
            .from("user_head_shot")
            .update({
              image_url: user.headShot.imageUrl,
              image_type: user.headShot.imageType,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.userId)
        : supabase.from("user_head_shot").insert({
            user_id: user.userId,
            image_url: user.headShot.imageUrl,
            image_type: user.headShot.imageType,
          });

    // if (count > 0) {
    //   // 如果大頭貼已經存在，執行更新
    //   await supabase
    //     .from("user_head_shot")
    //     .update({
    //       image_url: fieldValue.imageUrl,
    //       image_type: fieldValue.imageType,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("user_id", userId);
    // } else {
    //   // 如果大頭貼不存在，執行插入
    //   await supabase.from("user_head_shot").insert({
    //     user_id: userId,
    //     image_url: fieldValue.imageUrl,
    //     image_type: fieldValue.imageType,
    //   });
    // }

    const { error: updateError } = await updateOrInsert;

    if (updateError) {
      throw new Error(`Error saving headshot: ${updateError.message}`);
    }
  } catch (error) {
    console.error("Error updating user_head_shot:", error.message);
  }
};

// 儲存用戶興趣選項
export const saveUserSelectedOption = async ({ user }: { user: User }) => {
  try {
    const { error, count } = await supabase
      .from("user_selected_option")
      .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
      .eq("user_id", user.userId); // 篩選條件：id 等於 userId

    if (error) {
      console.error("Error checking existing user options:", error.message);
    }

    console.log("count selected option", count);
    const updateOrInsert =
      count > 0
        ? await supabase
            .from("user_selected_option")
            .update({
              interests: user.selectedOption?.interests,
              favorite_food: user.selectedOption?.favoriteFood,
              disliked_food: user.selectedOption?.dislikedFood,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.userId)
        : supabase.from("user_selected_option").insert({
            user_id: user.userId,
            interests: user.selectedOption?.interests,
            favorite_food: user.selectedOption?.favoriteFood,
            disliked_food: user.selectedOption?.dislikedFood,
          });

    // let result;
    // if (count > 0) {
    //   // 如果 興趣選項 已經存在，執行更新
    //   result = await supabase
    //     .from("user_selected_option")
    //     .update({
    //       interests: fieldValue.interests,
    //       favorite_food: fieldValue.favoriteFood,
    //       disliked_food: fieldValue.dislikedFood,
    //       updated_at: new Date().toISOString(),
    //     })
    //     .eq("user_id", userId);
    // } else {
    //   // 如果 興趣選項 不存在，執行插入
    //   result = await supabase.from("user_selected_option").insert({
    //     user_id: userId,
    //     interests: fieldValue.interests,
    //     favorite_food: fieldValue.favoriteFood,
    //     disliked_food: fieldValue.dislikedFood,
    //   });
    // }

    // 檢查更新結果
    // if (result.error) {
    //   throw result.error;
    // }'

    const { error: updateError } = await updateOrInsert;

    if (updateError) {
      throw new Error(`Error saving headshot: ${updateError.message}`);
    }
  } catch (error) {
    console.error("Error updating user_selected_option:", error);
  }
};
