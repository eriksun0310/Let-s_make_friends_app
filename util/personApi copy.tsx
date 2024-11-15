// import { EditUserFieldName, User } from "../shared/types";
// import { database } from "./firebaseConfig";
// import { get, ref, set, update } from "firebase/database";
// import { supabase } from "./supabaseClient";
// import { gender } from "../shared/static";

// // 取得自己的用戶資料
// // export const getUserData = async (userId: string) => {
// //   const userRef = ref(database, `users/${userId}`);
// //   const snapshot = await get(userRef);
// //   if (snapshot.exists()) {
// //     return snapshot.val();
// //   } else {
// //     return null;
// //   }
// // };

// export const getUserData = async ({
//   userId,
//   email,
// }: {
//   userId: string;
//   email: string;
// }) => {
//   const { data, error, count } = await supabase
//     .from("users")
//     .select("*", { count: "exact" })
//     .eq("userid", userId); // 篩選條件：id 等於 userId
//   if (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
//   console.log("count", count);
//   console.log("data", data);
//   // 新用戶
//   if (count === 0) {
//     console.log("new user");
//     // const { data: insertData, error } = await supabase.from("users").insert({
//     //   userid: userId,
//     //   email: email,
//     //   name: "",
//     //   gender: "female",
//     //   introduce: "",
//     //   birthday: "",
//     // });

//     if (error) {
//       console.error("Error inserting user data:", error);
//       return null;
//     }

//     // console.log('insertData', insertData)

//     return null;
//   }

//   console.log("data", data);
//   return data[0]; // 只有一筆資料時返回
// };

// // 新增用戶
// export const createNewUser = async ({
//   userId,
//   email,
// }: {
//   userId: string;
//   email: string;
// }) => {
//   const { data: insertData, error } = await supabase.from("users").insert({
//     userid: userId,
//     email: email,
//     name: "",
//     gender: "female",
//     introduce: "",
//     birthday: "",
//   });

//   if (error) {
//     console.error("Error inserting user data:", error);
//     return null;
//   }

//   console.log("success", insertData);
// };

// // export const getUserHeadShot = async (userId: string) => {
// //   const { data, error, count } = await supabase
// //     .from("user_head_shot")
// //     .select("*", { count: "exact" })
// //     .eq("user_id", userId); // 篩選條件：id 等於 userId

// //   console.log("count", count);

// //   if (error) {
// //     console.error("Error fetching user data:", error);
// //     return null;
// //   }

// //   if (count === 0) {
// //     console.log("No user found with the given userId.");

// //     const { data, error } = await supabase.from("users").insert({
// //       userid: user.userId,
// //       email: user.email,
// //       name: "",
// //       gender: user.gender,
// //       introduce: "",
// //       birthday: "",
// //     });

// //     return null;
// //   }

// //   // console.log('count', count);

// //   // if (count > 1) {
// //   //   console.log("Multiple users found with the given userId.");
// //   //   return null;
// //   // }

// //   console.log("User Data:", data); // 印出用戶資料
// //   return data[0]; // 只有一筆資料時返回
// // };

// // 儲存自己的基本資料
// export const saveUserData = async (user: User) => {
//   try {
//     console.log("user", user);

//     // 儲存用戶資料
//     const { error: userError } = await supabase.from("users").upsert({
//       userid: user.userId,
//       name: user.name,
//       email: user.email,
//       gender: user.gender,
//       introduce: user.introduce,
//       birthday: user.birthday,
//       updated_at: new Date().toISOString(),
//     });

//     if (userError) throw userError;

//     // 儲存 用戶頭像資料
//     // if (user.headShot) {
//     //   const { error: headShotError } = await supabase
//     //     .from("user_head_shot")
//     //     .upsert({
//     //       user_id: user.userId,
//     //       image_url: user.headShot.imageUrl,
//     //       image_type: user.headShot.imageType || "people",
//     //       updated_at: new Date().toISOString(),
//     //     });

//     //   if (headShotError) throw headShotError;
//     // }

//     // 儲存用戶選項資料
//     // if (user.selectedOption) {
//     //   console.log("user.selectedOption", user.selectedOption);
//     //   const { error: optionsError } = await supabase
//     //     .from("user_options")
//     //     .upsert({
//     //       user_id: user.userId,
//     //       interests: user.selectedOption.interests || [],
//     //       favorite_food: user.selectedOption.favoriteFood || [],
//     //       disliked_food: user.selectedOption.dislikedFood || [],
//     //       updated_at: new Date().toISOString(),
//     //     });

//     //   if (optionsError) throw optionsError;
//     // }

//     // await set(ref(database, `users/${user.userId}`), {
//     //   ...user,
//     // });

//     console.log("User data saved successfully");
//   } catch (error) {
//     console.error("Error saving user data:", error);
//   }
// };

// // 編輯自己的資料(for:單一欄位)
// // export const editUserData = async ({
// //   userId,
// //   fieldName,
// //   fieldValue,
// // }: {
// //   userId: string;
// //   fieldName: string;
// //   fieldValue: any;
// // }) => {
// //   console.log("fieldName", fieldName);
// //   console.log("fieldValue", fieldValue);
// //   try {
// //     const updates: Record<string, any> = {};
// //     updates[fieldName] = fieldValue;

// //     await update(ref(database, `users/${userId}`), updates);
// //   } catch (error) {
// //     console.error("Error updating user data:", error);
// //   }
// // };

// // export const editUserData1 = async ({
// //   userId,
// //   fieldName,
// //   fieldValue,
// // }: {
// //   userId: string;
// //   fieldName: EditUserFieldName;
// //   fieldValue: any;
// // }) => {
// //   try {
// //     let updateResult;
// //     // 判斷欄位所屬的資料表
// //     if (["name", "introduce"].includes(fieldName)) {
// //       // 更新用戶資料表

// //       updateResult = await supabase.from("users");
// //     }

// //     const updates: Record<string, any> = {};
// //     updates[fieldName] = fieldValue;

// //     await update(ref(database, `users/${userId}`), updates);
// //   } catch (error) {
// //     console.error("Error updating user data:", error);
// //   }
// // };

// export const editUserData = async ({
//   user,
//   fieldName,
//   fieldValue,
// }: {
//   user: User;
//   fieldName: EditUserFieldName;
//   fieldValue: any;
// }) => {
//   try {
//     console.log("user", user);
//     let updateResult;

//     const userData = await getUserData(user.userId);
//     console.log("userData", userData);
//     if (!userData) {
//       console.log("qqqq");
//       const { data, error } = await supabase.from("users").insert({
//         userid: user.userId,
//         email: user.email,
//         name: "",
//         gender: user.gender,
//         introduce: "",
//         birthday: "",
//       });

//       if (error) {
//         console.error("Error inserting user data:", error);
//         return;
//       }
//       console.log("Users inserted successfully:", data);
//     }

//     // if (["headShot"].includes(fieldName)) {
//     //   const {
//     //     data: existingHeadShot,
//     //     error: selectError,
//     //     count,
//     //   } = await supabase
//     //     .from("user_head_shot")
//     //     .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
//     //     .eq("user_id", user.userId); // 篩選條件：id 等於 userId

//     //   if (selectError) {
//     //     console.error("Error checking existing headshot:", selectError);
//     //   }

//     //   console.log("existingHeadShot", existingHeadShot);
//     //   // let updateResult;
//     //   if (count > 0) {
//     //     // 如果大頭貼已經存在，執行更新
//     //     updateResult = await supabase
//     //       .from("user_head_shot")
//     //       .update({
//     //         image_url: fieldValue.imageUrl,
//     //         image_type: fieldValue.imageType,
//     //         updated_at: new Date().toISOString(),
//     //       })
//     //       .eq("user_id", user.userId);
//     //   } else {
//     //     // 如果大頭貼不存在，執行插入
//     //     updateResult = await supabase.from("user_head_shot").insert({
//     //       user_id: user.userId,
//     //       image_url: fieldValue.imageUrl,
//     //       image_type: fieldValue.imageType,
//     //     });
//     //   }
//     // }
//     // 判斷欄位所屬的資料表
//     if (["name", "introduce"].includes(fieldName)) {
//       console.log(" introduce fieldValue", fieldValue);
//       // 更新基本用戶資料
//       updateResult = await supabase
//         .from("users")
//         .upsert({
//           [fieldName]: fieldValue,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("userid", user.userId);
//     } else if (["headShot"].includes(fieldName)) {
//       const {
//         data: existingHeadShot,
//         error: selectError,
//         count,
//       } = await supabase
//         .from("user_head_shot")
//         .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
//         .eq("user_id", user.userId); // 篩選條件：id 等於 userId

//       if (selectError) {
//         console.error("Error checking existing headshot:", selectError);
//       }

//       console.log("existingHeadShot", existingHeadShot);
//       // let updateResult;
//       if (count > 0) {
//         // 如果大頭貼已經存在，執行更新
//         updateResult = await supabase
//           .from("user_head_shot")
//           .update({
//             image_url: fieldValue.imageUrl,
//             image_type: fieldValue.imageType,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("user_id", user.userId);
//       } else {
//         // 如果大頭貼不存在，執行插入
//         updateResult = await supabase.from("user_head_shot").insert({
//           user_id: user.userId,
//           image_url: fieldValue.imageUrl,
//           image_type: fieldValue.imageType,
//         });
//       }
//     } else if (["selectedOption"].includes(fieldName)) {
//       // 更新用戶選項資料

//       updateResult = await supabase
//         .from("user_options")
//         .upsert({
//           interests: fieldValue.interests,
//           favorite_food: fieldValue.favoriteFood,
//           disliked_food: fieldValue.dislikedFood,

//           updated_at: new Date().toISOString(),
//         })
//         .eq("user_id", user.userId);
//     } else {
//       throw new Error(`Unsupported field name: ${fieldName}`);
//     }

//     // 檢查更新結果
//     if (updateResult.error) {
//       throw updateResult.error;
//     }

//     console.log("User  data updated successfully");
//   } catch (error) {
//     console.error("Error updating user data:", error);
//   }
// };

// // 更新 users 單一欄位(introduce、name) updateUser()
// // 儲存 users 表 saveUser()
// // 儲存 user_head_shot saveUserHeadShot()
// // 儲存 user_selected_option saveUserSelectedOption()

// // 
// export const saveUserData1 = async ({
//   user,
//   fieldName,
//   fieldValue,
// }: {
//   user: User;
//   fieldName: EditUserFieldName;
//   fieldValue: any;
// }) => {
//   try {
//     console.log("user", user);
//     let updateResult;

//     const userData = await getUserData(user.userId);
//     console.log("userData", userData);
//     if (!userData) {
//       console.log("qqqq");
//       const { data, error } = await supabase.from("users").insert({
//         userid: user.userId,
//         email: user.email,
//         name: "",
//         gender: user.gender,
//         introduce: "",
//         birthday: "",
//       });

//       if (error) {
//         console.error("Error inserting user data:", error);
//         return;
//       }
//       console.log("Users inserted successfully:", data);
//     }

//     // if (["headShot"].includes(fieldName)) {
//     //   const {
//     //     data: existingHeadShot,
//     //     error: selectError,
//     //     count,
//     //   } = await supabase
//     //     .from("user_head_shot")
//     //     .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
//     //     .eq("user_id", user.userId); // 篩選條件：id 等於 userId

//     //   if (selectError) {
//     //     console.error("Error checking existing headshot:", selectError);
//     //   }

//     //   console.log("existingHeadShot", existingHeadShot);
//     //   // let updateResult;
//     //   if (count > 0) {
//     //     // 如果大頭貼已經存在，執行更新
//     //     updateResult = await supabase
//     //       .from("user_head_shot")
//     //       .update({
//     //         image_url: fieldValue.imageUrl,
//     //         image_type: fieldValue.imageType,
//     //         updated_at: new Date().toISOString(),
//     //       })
//     //       .eq("user_id", user.userId);
//     //   } else {
//     //     // 如果大頭貼不存在，執行插入
//     //     updateResult = await supabase.from("user_head_shot").insert({
//     //       user_id: user.userId,
//     //       image_url: fieldValue.imageUrl,
//     //       image_type: fieldValue.imageType,
//     //     });
//     //   }
//     // }
//     // 判斷欄位所屬的資料表
//     if (["name", "introduce"].includes(fieldName)) {
//       console.log(" introduce fieldValue", fieldValue);
//       // 更新基本用戶資料
//       updateResult = await supabase
//         .from("users")
//         .upsert({
//           [fieldName]: fieldValue,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("userid", user.userId);
//     } else if (["headShot"].includes(fieldName)) {
//       const {
//         data: existingHeadShot,
//         error: selectError,
//         count,
//       } = await supabase
//         .from("user_head_shot")
//         .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
//         .eq("user_id", user.userId); // 篩選條件：id 等於 userId

//       if (selectError) {
//         console.error("Error checking existing headshot:", selectError);
//       }

//       console.log("existingHeadShot", existingHeadShot);
//       // let updateResult;
//       if (count > 0) {
//         // 如果大頭貼已經存在，執行更新
//         updateResult = await supabase
//           .from("user_head_shot")
//           .update({
//             image_url: fieldValue.imageUrl,
//             image_type: fieldValue.imageType,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("user_id", user.userId);
//       } else {
//         // 如果大頭貼不存在，執行插入
//         updateResult = await supabase.from("user_head_shot").insert({
//           user_id: user.userId,
//           image_url: fieldValue.imageUrl,
//           image_type: fieldValue.imageType,
//         });
//       }
//     } else if (["selectedOption"].includes(fieldName)) {
//       // 更新用戶選項資料

//       updateResult = await supabase
//         .from("user_options")
//         .upsert({
//           interests: fieldValue.interests,
//           favorite_food: fieldValue.favoriteFood,
//           disliked_food: fieldValue.dislikedFood,

//           updated_at: new Date().toISOString(),
//         })
//         .eq("user_id", user.userId);
//     } else {
//       throw new Error(`Unsupported field name: ${fieldName}`);
//     }

//     // 檢查更新結果
//     if (updateResult.error) {
//       throw updateResult.error;
//     }

//     console.log("User  data updated successfully");
//   } catch (error) {
//     console.error("Error updating user data:", error);
//   }
// };

// // 儲存用戶大頭貼
// export const saveUserHeadShot = async ({
//   userId,
//   fieldValue,
// }: {
//   userId: string;
//   fieldValue: any;
// }) => {
//   console.log("userId", userId);
//   let updateResult;
//   try {
//     const {
//       data: existingHeadShot,
//       error: selectError,
//       count,
//     } = await supabase
//       .from("user_head_shot")
//       .select("user_id", { count: "exact" })
//       .eq("user_id", userId);

//     console.log("Supabase response:", { existingHeadShot, selectError, count });
//     if (selectError) {
//       console.error("Error checking existing headshot:", selectError);
//     }

//     console.log("count", count);
//     console.log("existingHeadShot", existingHeadShot);
//     // let updateResult;
//     if (count > 0) {
//       console.log(11111);
//       // 如果大頭貼已經存在，執行更新
//       updateResult = await supabase
//         .from("user_head_shot")
//         .update({
//           image_url: fieldValue.imageUrl,
//           image_type: fieldValue.imageType,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("user_id", userId);
//     } else {
//       console.log(22222);
//       // 如果大頭貼不存在，執行插入
//       updateResult = await supabase.from("user_head_shot").insert({
//         user_id: userId,
//         image_url: fieldValue.imageUrl,
//         image_type: fieldValue.imageType,
//       });
//     }
//   } catch (error) {
//     console.error("Error updating user_head_shot:", error);
//   }
// };

// // export const saveUserHeadShot = async ({
// //   userId,
// //   fieldValue,
// // }: {
// //   userId: string;
// //   fieldValue: {
// //     imageUrl: string;
// //     imageType: string;
// //   };
// // }) => {
// //   console.log("Processing user headshot for userId:", userId);

// //   try {
// //     // 使用單一查詢來獲取完整的記錄，而不是只查詢 user_id
// //     const { data, error: selectError } = await supabase
// //       .from("user_head_shot")
// //       .select("*")
// //       .eq("user_id", userId)
// //       .maybeSingle();  // 使用 maybeSingle() 來獲取單一記錄或 null

// //     if (selectError) {
// //       console.error("Error checking existing headshot:", selectError);
// //       throw selectError;
// //     }

// //     console.log("Existing record:", data);

// //     let updateResult;

// //     if (data) {
// //       console.log("Updating existing record");
// //       updateResult = await supabase
// //         .from("user_head_shot")
// //         .update({
// //           image_url: fieldValue.imageUrl,
// //           image_type: fieldValue.imageType,
// //           updated_at: new Date().toISOString(),
// //         })
// //         .eq("user_id", userId)
// //         .select();  // 添加 select() 來獲取更新後的記錄
// //     } else {
// //       console.log("Creating new record");
// //       updateResult = await supabase
// //         .from("user_head_shot")
// //         .insert({
// //           user_id: userId,
// //           image_url: fieldValue.imageUrl,
// //           image_type: fieldValue.imageType,
// //           created_at: new Date().toISOString(),
// //           updated_at: new Date().toISOString(),
// //         })
// //         .select();  // 添加 select() 來獲取插入的記錄
// //     }

// //     if (updateResult.error) {
// //       console.error("Error updating/inserting record:", updateResult.error);
// //       throw updateResult.error;
// //     }

// //     console.log("Operation successful:", updateResult.data);
// //     return updateResult.data;

// //   } catch (error) {
// //     console.error("Error in saveUserHeadShot:", error);
// //     throw error;  // 向上傳遞錯誤以便調用方處理
// //   }
// // };

// // 儲存用戶興趣選項
// export const saveUserSelectedOption = async ({
//   userId,
//   fieldValue,
// }: {
//   userId: string;
//   fieldValue: any;
// }) => {
//   console.log("userId", userId);
//   console.log("fieldValue", fieldValue);
//   let updateResult;
//   try {
//     const {
//       data: existingUserOptions,
//       error: selectError,
//       count,
//     } = await supabase
//       .from("user_options")
//       .select("user_id", { count: "exact" }) // 只查詢 user_id，減少不必要的資料
//       .eq("user_id", userId); // 篩選條件：id 等於 userId

//     if (selectError) {
//       console.error("Error checking existing user options:", selectError);
//     }

//     console.log("existingUserOptions", existingUserOptions);
//     // let updateResult;
//     if (count > 0) {
//       // 如果 興趣選項 已經存在，執行更新
//       updateResult = await supabase
//         .from("user_options")
//         .update({
//           interests: fieldValue.interests,
//           favorite_food: fieldValue.favoriteFood,
//           disliked_food: fieldValue.dislikedFood,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("user_id", userId);
//     } else {
//       // 如果 興趣選項 不存在，執行插入
//       updateResult = await supabase.from("user_options").insert({
//         user_id: userId,
//         interests: fieldValue.interests,
//         favorite_food: fieldValue.favoriteFood,
//         disliked_food: fieldValue.dislikedFood,
//       });
//     }
//   } catch (error) {
//     console.error("Error updating user_options:", error);
//   }
// };
