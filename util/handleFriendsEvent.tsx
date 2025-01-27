import {
  transformFriendRequest,
  transformFriendRequests,
} from "shared/friend/friendUtils";
import {
  FriendDBType,
  UserHeadShotDBType,
  UserSelectedOptionDBType,
  UserSettingsDBType,
} from "../shared/dbType";
import { FriendRequest, FriendState, Result, User } from "../shared/types";
import { transformUser } from "../shared/user/userUtils";
import { getUserDetail, getUsersDetail } from "./handleUserEvent";
import { supabase } from "./supabaseClient";

interface FriendProps {
  senderId: string;
  receiverId: string;
}

/*
處理 加好友的 db 操作
friend_requests: 好友邀請
friends: 好友列表
*/

// type GetFriendDetailReturn = Result & {
//   data: User | null;
// };

//取得(單一)好友詳細資料
// export const getFriendDetail = async ({
//   friendId,
// }: {
//   friendId: string;
// }): Promise<GetFriendDetailReturn> => {
//   try {
//     // 查詢 users
//     const { data, error } = await supabase
//       .from("users")
//       .select(
//         `
//         id,
//         name,
//         gender,
//         introduce,
//         birthday,
//         email,
//         created_at,
//         updated_at,
//         user_head_shot(image_url, image_type),
//         user_selected_option(interests, favorite_food, disliked_food)
//         `
//       )
//       .eq("id", friendId)
//       .single(); // 單筆記錄，因為 friendId 是唯一的

//     if (error) {
//       console.error("Error fetching users:", error);
//       return {
//         success: false,
//         errorMessage: error.message,
//         data: null,
//       };
//     }

//     const transformedUser = transformUser({
//       users: data,
//       userHeadShot: data.user_head_shot as unknown as UserHeadShotDBType,
//       userSelectedOption:
//         data.user_selected_option as unknown as UserSelectedOptionDBType,
//     });

//     return {
//       success: true,
//       data: transformedUser,
//     };
//   } catch (error) {
//     console.log("取得好友詳細資料錯誤", error);
//     return {
//       success: false,
//       errorMessage: (error as Error).message,
//       data: null,
//     };
//   }
// };

// export const getFriendDetails = async (
//   friendIds: string[]
// ): Promise<User[]> => {
//   try {
//     // 查詢 users
//     const { data, error } = await supabase
//       .from("users")
//       .select(
//         `
//         id,
//         name,
//         gender,
//         introduce,
//         birthday,
//         email,
//         created_at,
//         updated_at,
//         user_head_shot(image_url, image_type),
//         user_selected_option(interests, favorite_food, disliked_food)
//         `
//       )
//       .in("id", friendIds);

//     if (error) {
//       console.error("Error fetching users:", error);
//       return [];
//     }

//     if (!data || data.length === 0) {
//       console.log("好友詳細資料為空");
//       return [];
//     }

//     return data.map((user) =>
//       transformUser({
//         users: user,
//         userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
//         userSelectedOption:
//           user.user_selected_option as unknown as UserSelectedOptionDBType,
//       })
//     );
//   } catch (error) {
//     console.log("取得好友詳細資料錯誤", error);
//     return [];
//   }
// };

// 取得可以成為好友的用戶 - origin
// export const getAllUsers = async (currentUserId: string) => {
//   try {
//     const { data: friendRequests, error: friendRequestsError } = await supabase
//       .from("friend_requests")
//       .select("sender_id, receiver_id")
//       .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`); // 同時過濾 sender 和 receiver

//     if (friendRequestsError) {
//       console.error("Error fetching friend requests:", friendRequestsError);
//       return [];
//     }

//     // 整理需要排除的用戶 ID
//     const excludeUserIds = friendRequests.flatMap((req) => [
//       req.sender_id,
//       req.receiver_id,
//     ]);

//     // 查詢 `users` 表，排除自己和所有已經有好友邀請關係的用戶
//     const { data: usersData, error: usersError } = await supabase
//       .from("users")
//       .select(
//         "id, name, gender, introduce, birthday, email, created_at, updated_at"
//       )
//       .neq("id", currentUserId) // 排除自己的 userId
//       .not("id", "in", `(${excludeUserIds.join(",")})`); // 排除所有與好友邀請相關的用戶

//     if (usersError) {
//       console.error("Error fetching users:", usersError);
//       return [];
//     }

//     // 查詢 `user_head_shot` 表的必要欄位
//     const { data: headShotsData, error: headShotsError } = await supabase
//       .from("user_head_shot")
//       .select("user_id, image_url, image_type"); // 指定需要的欄位

//     if (headShotsError) {
//       console.error("Error fetching user headshots:", headShotsError);
//     }

//     // 查詢 `user_selected_option` 表的必要欄位
//     const { data: selectedOptionsData, error: selectedOptionsError } =
//       await supabase
//         .from("user_selected_option")
//         .select("user_id, interests, favorite_food, disliked_food"); // 指定需要的欄位

//     if (selectedOptionsError) {
//       console.error(
//         "Error fetching user selected options:",
//         selectedOptionsError
//       );
//     }

//     // 整合三張表的資料
//     const allUsers = usersData.map((user) => {
//       // 找到對應的頭像資料
//       const headShot = headShotsData?.find((h) => h.user_id === user.id) || {
//         image_type: "people",
//         image_url: "",
//       } as UserHeadShotDBType;

//       // 找到對應的選項資料
//       const selectedOption = selectedOptionsData?.find(
//         (s) => s.user_id === user.id
//       ) || {
//         interests: [],
//         favorite_food: [],
//         disliked_food: [],
//       } as UserSelectedOptionDBType;

//       const transformedUser = transformUser({
//         users: user,
//         userHeadShot: headShot,
//         userSelectedOption: selectedOption,
//       });

//       return transformedUser;
//     });

//     // 返回整合後的用戶陣列
//     return allUsers;
//   } catch (error) {
//     console.error("Error fetching all users:", error);
//     return [];
//   }
// };

type GetAllUsersReturn = {
  success: boolean;
  errorMessage?: string;
  data: User[];
};

// ☑️取得可以成為好友的用戶
export const getBeFriendUsers = async ({
  currentUserId,
}: {
  currentUserId: string;
}): Promise<GetAllUsersReturn> => {
  try {
    // 查詢 friend_requests 獲取需要排除的 userId
    const { data: friendRequests, error: friendRequestsError } = await supabase
      .from("friend_requests")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

    if (friendRequestsError) {
      console.error("取得 friend requests 失敗", friendRequestsError);
      return {
        success: false,
        errorMessage: friendRequestsError.message,
        data: [],
      };
    }

    // 整理需要排除的用戶 ID
    const excludeUserIds = [
      currentUserId,
      ...friendRequests.flatMap((req) => [req.sender_id, req.receiver_id]),
    ];

    // 查詢 users 並嵌套相關表
    const { data: users, error: usersError } = await supabase
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
        user_selected_option(interests, favorite_food, disliked_food),
        user_settings(hide_likes, hide_comments, mark_as_read)
        `
      )
      .not("id", "in", `(${excludeUserIds.join(",")})`); // 排除自己、好友邀請中的用戶

    if (usersError) {
      console.error("查詢 users 失敗", usersError);
      return {
        success: false,
        errorMessage: usersError.message,
        data: [],
      };
    }

    const allUsers = users.map((user) => {
      const transformedUser = transformUser({
        users: user,
        userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
        userSelectedOption:
          user.user_selected_option as unknown as UserSelectedOptionDBType,
        userSettings:
          (user.user_settings as unknown as UserSettingsDBType) ?? null,
      });
      return transformedUser;
    });

    return {
      success: true,
      data: allUsers,
    };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

type GetFriendRequestsProps = Result & {
  data: FriendRequest[];
};
// 取得其他用戶寄送的交友邀請
export const getFriendRequests = async ({
  userId,
}: {
  userId: string;
}): Promise<GetFriendRequestsProps> => {
  try {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (error) {
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    const transformedFriendRequests = transformFriendRequests(data);

    return {
      success: true,
      data: transformedFriendRequests,
    };
  } catch (error) {
    console.error("取得交友邀請失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};

/*
ex:111 寄給 222  
senderId: 111.user_id
receiverId: 222.user_id
*/
// ☑️發送交友邀請
export const sendFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<Result> => {
  try {
    const { error } = await supabase.from("friend_requests").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
      is_read: false, // 設置為未讀
    });
    if (error) {
      console.error("發送交友邀請失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("發送交友邀請失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type UpdateFriendRequestStatusProps = Result & {
  data: FriendRequest | null;
};

// ☑️更新 friend_requests 狀態 (接受或拒絕)
const updateFriendRequestStatus = async ({
  senderId,
  receiverId,
  status,
}: {
  senderId: string;
  receiverId: string;
  status: Omit<FriendState, "add">;
}): Promise<UpdateFriendRequestStatusProps> => {
  try {
    // 更新 friend_requests 狀態
    const { data: updateFriendRequest, error } = await supabase
      .from("friend_requests")
      .update({
        status: status,
      })
      .eq("sender_id", senderId)
      .eq("receiver_id", receiverId)
      .select("*")
      .maybeSingle();
    if (error) {
      console.log("更新 friend_requests 狀態 失敗", error);
      return {
        success: false,
        errorMessage: error?.message,
        data: null,
      };
    }

    const transformedFriendRequest =
      transformFriendRequest(updateFriendRequest);
    return {
      success: true,
      data: transformedFriendRequest,
    };
  } catch (error) {
    console.log("更新 friend_requests 狀態 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: null,
    };
  }
};

type GetFriendListReturn = Result & {
  data: User[];
};
// ☑️取得好友列表
export const getFriendList = async ({
  currentUserId,
}: {
  currentUserId: string;
}): Promise<GetFriendListReturn> => {
  try {
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", currentUserId);

    if (friendsError) {
      console.error("取得好友列表 失敗", friendsError);

      return {
        success: false,
        errorMessage: friendsError?.message,
        data: [],
      };
    }

    if (!friendsData || friendsData.length === 0) {
      // console.log("沒有好友");
      return {
        success: true,
        data: [],
      };
    }

    // // 獲取每個好友的詳細資料
    // const allFriendsDetails1 = await Promise.all(
    //   friendsData.map(async (friend) => {
    //     const { data: friendDetail } = await getUserDetail({
    //       userId: friend.friend_id,
    //     });
    //     return friendDetail; // 返回每個好友的詳細資料
    //   })
    // );

    // 獲取每個好友的詳細資料
    const { data: allFriendsDetails } = await getUsersDetail({
      userIds: friendsData.map((friend) => friend.friend_id),
    });

    // 過濾掉返回為空的好友數據
    return {
      success: true,
      data: allFriendsDetails.filter((friendDetail) => friendDetail !== null),
    };
  } catch (error) {
    console.error("取得好友列表 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error)?.message,
      data: [],
    };
  }
};

// ☑️新增 好友資訊到 friends 表
const insertFriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Result> => {
  try {
    // 插入 user_id 和 friend_id 的關聯
    const { error: insertError1 } = await supabase.from("friends").insert({
      user_id: userId,
      friend_id: friendId,
      is_read: false,
    });
    if (insertError1) {
      console.log("新增好友資訊 失敗", insertError1);
      return {
        success: false,
        errorMessage: insertError1?.message,
      };
    }

    // 插入反向關聯 friend_id 和 user_id 的關聯
    const { error: insertError2 } = await supabase.from("friends").insert({
      user_id: friendId,
      friend_id: userId,
      is_read: false,
    });

    if (insertError2) {
      console.log("新增好友資訊 失敗", insertError2);
      return {
        success: false,
        errorMessage: insertError2?.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error)?.message,
    };
  }
};

type AcceptedFriendRequestProps = Result & {
  data: FriendRequest | null;
};

// ☑️接受交友邀請
export const acceptedFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<AcceptedFriendRequestProps> => {
  try {
    const {
      success,
      data: updateFriendRequest,
      errorMessage,
    } = await updateFriendRequestStatus({
      senderId: senderId,
      receiverId: receiverId,
      status: "accepted",
    });

    if (!success) {
      console.log("接受交友邀請 失敗", errorMessage);
      return {
        success: false,
        errorMessage: errorMessage,
        data: null,
      };
    }

    // 新增好友資訊到 friends 表
    await insertFriend({
      userId: senderId,
      friendId: receiverId,
    });

    return { success: true, data: updateFriendRequest };
  } catch (error) {
    console.log("接受交友邀請 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error)?.message,
      data: null,
    };
  }
};

// ☑️這是給 加好友想刪除好友用的(因為friend_requests 沒有資料要用insert)
export const insertRejectedFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<Result> => {
  try {
    const { error } = await supabase.from("friend_requests").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "rejected",
      is_read: true, // 設置為已讀
    });
    if (error) {
      console.log("加好友UI 刪除好友 失敗", error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("加好友UI 刪除好友 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error).message,
    };
  }
};

type UpdateRejectedFriendRequestProps = Result & {
  data: FriendRequest | null;
};

// ☑️拒絕交友邀請(給對方有寄送交友邀請用的)
export const updateRejectedFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<UpdateRejectedFriendRequestProps> => {
  try {
    const {
      success,
      data: updateFriendRequest,
      errorMessage,
    } = await updateFriendRequestStatus({
      senderId,
      receiverId,
      status: "rejected",
    });

    if (!success) {
      console.log("拒絕交友邀請 失敗", errorMessage);
      return {
        success: false,
        errorMessage: errorMessage,
        data: null,
      };
    }

    return { success: true, data: updateFriendRequest };
  } catch (error) {
    console.log("拒絕交友邀請 失敗", error);
    return {
      success: false,
      errorMessage: (error as Error)?.message,
      data: null,
    };
  }
};

//☑️刪除(單一)好友
export const deleteFriendDB = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<Result> => {
  try {
    // 删除 user_id 和 friend_id 组成的记录
    const { error } = await supabase
      .from("friends")
      .delete()
      // 刪除兩筆紀錄(user_id 和 friend_id 互為好友的紀錄)
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
      );

    if (error) {
      console.log("刪除好友 失敗", error);
      return { success: false, errorMessage: error.message };
    }

    return { success: true };
  } catch (error) {
    console.log("刪除好友 失敗", error);
    return { success: false, errorMessage: (error as Error).message };
  }
};

// 標記所有交友邀請為已讀
export const markInvitationsAsRead = async ({
  userId,
}: {
  userId: string;
}): Promise<Result> => {
  try {
    const { error } = await supabase
      .from("friend_requests")
      .update({ is_read: true })
      .eq("receiver_id", userId)
      .eq("is_read", false); // 只更新尚未讀取的邀請

    if (error) {
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

//  標記所有新好友為已讀
export const markNewFriendsAsRead = async ({
  userId,
}: {
  userId: string;
}): Promise<Result> => {
  try {
    const { error } = await supabase
      .from("friends")
      .update({ is_read: true }) // 更新为已通知
      .eq("user_id", userId)
      .eq("is_read", false); // 仅更新未通知的记录

    if (error) {
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

type GetFriendsUnRead = Result & {
  data: FriendDBType[];
};

// 取得好友列表未已讀的紀錄
export const getFriendsUnRead = async ({
  userId,
}: {
  userId: string;
}): Promise<GetFriendsUnRead> => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false); // 取得未已讀的紀錄

    if (error) {
      return {
        success: false,
        errorMessage: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: (error as Error).message,
      data: [],
    };
  }
};
