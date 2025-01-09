import { UserHeadShotDBType, UserSelectedOptionDBType } from "../shared/dbType";
import { Result, User } from "../shared/types";
import { transformUser } from "../shared/user/userUtils";
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

//取得(單一)好友詳細資料
export const getFriendDetail = async (
  friendId: string
): Promise<User | null> => {
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
      .eq("id", friendId)
      .single(); // 單筆記錄，因為 friendId 是唯一的

    if (error) {
      console.error("Error fetching users:", error);
      return null;
    }

    const transformedUser = transformUser({
      users: data,
      userHeadShot: data.user_head_shot as unknown as UserHeadShotDBType,
      userSelectedOption:
        data.user_selected_option as unknown as UserSelectedOptionDBType,
    });

    return transformedUser;
  } catch (error) {
    console.log("取得好友詳細資料錯誤", error);
    return null;
  }
};

export const getFriendDetails = async (
  friendIds: string[]
): Promise<User[]> => {
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
      .in("id", friendIds);

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("好友詳細資料為空");
      return [];
    }

    return data.map((user) =>
      transformUser({
        users: user,
        userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
        userSelectedOption:
          user.user_selected_option as unknown as UserSelectedOptionDBType,
      })
    );
  } catch (error) {
    console.log("取得好友詳細資料錯誤", error);
    return [];
  }
};

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

export const getAllUsers = async (currentUserId: string) => {
  try {
    // 查詢 friend_requests 獲取需要排除的 userId
    const { data: friendRequests, error: friendRequestsError } = await supabase
      .from("friend_requests")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

    if (friendRequestsError) {
      console.error("Error fetching friend requests:", friendRequestsError);
      return [];
    }

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
        user_selected_option(interests, favorite_food, disliked_food)
        `
      )
      .not("id", "in", `(${excludeUserIds.join(",")})`);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return [] as User[];
    }

    const allUsers = users.map((user) => {
      const transformedUser = transformUser({
        users: user,
        userHeadShot: user.user_head_shot as unknown as UserHeadShotDBType,
        userSelectedOption:
          user.user_selected_option as unknown as UserSelectedOptionDBType,
      });
      return transformedUser;
    });

    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

/*
ex:111 寄給 222  
senderId: 111.user_id
receiverId: 222.user_id
*/
// 發送交友邀請
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
      console.error("Error sending friend request:", error);
      return {
        success: false,
        errorMessage: "Failed to send friend request. Please try again later.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      errorMessage: "An error occurred. Please try again later.",
    };
  }
};

// 更新 friend_requests 狀態
const updateFriendRequestStatus = async ({
  senderId,
  receiverId,
  status,
}: {
  senderId: string;
  receiverId: string;
  status: "accepted" | "rejected";
}): Promise<Result> => {
  // 更新 friend_requests 狀態
  const { error } = await supabase
    .from("friend_requests")
    .update({
      status: status,
      //updated_at: new Date().toISOString(),
    })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId);

  if (error) {
    console.error("Error updating friend request status:", error);
    return { success: false, errorMessage: error?.message };
  }

  return {
    success: true,
  };
};

// 取得好友列表
export const getFriendList = async (
  currentUserId: string
): Promise<{
  success: boolean;
  errorMessage?: string;
  data: User[];
}> => {
  try {
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", currentUserId);

    if (friendsError) {
      console.error("Error fetching friends:", friendsError);

      return {
        success: false,
        errorMessage: friendsError?.message,
        data: [],
      };
    }

    if (!friendsData || friendsData.length === 0) {
      console.log("No friends found for the user.");
      return {
        success: true,
        errorMessage: "沒有好友",
        data: [],
      };
    }

    // 獲取每個好友的詳細資料
    const allFriendsDetails = await Promise.all(
      friendsData.map(async (friend) => {
        const friendDetail = await getFriendDetail(friend.friend_id);
        return friendDetail; // 返回每個好友的詳細資料
      })
    );

    // 過濾掉返回為空的好友數據
    return {
      success: true,
      data: allFriendsDetails.filter((friendDetail) => friendDetail !== null),
    };
  } catch (error) {
    console.error("Error fetching friends:", error);
    return {
      success: false,
      errorMessage: (error as Error)?.message,
      data: [],
    };
  }
};

// 新增 好友資訊到 friends 表
const insertFriend = async ({
  userId,
  friendId,
}: {
  userId: string;
  friendId: string;
}): Promise<void> => {
  try {
    // 插入 user_id 和 friend_id 的關聯
    const { error: insertError1 } = await supabase.from("friends").insert({
      user_id: userId,
      friend_id: friendId,
      notified: false,
    });
    if (insertError1) {
      console.error("Error inserting friend record 1:", insertError1);
      throw insertError1; // 拋出錯誤
    }

    // 插入反向關聯 friend_id 和 user_id 的關聯
    const { error: insertError2 } = await supabase.from("friends").insert({
      user_id: friendId,
      friend_id: userId,
      notified: false,
    });

    if (insertError2) {
      console.error("Error inserting friend record 2:", insertError2);
      throw insertError2; // 拋出錯誤
    }
  } catch (error) {
    console.error("Error inserting friend:", error);
  }
};

// 確認交友邀請
export const acceptedFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<Result> => {
  try {
    const { success, errorMessage } = await updateFriendRequestStatus({
      senderId: senderId,
      receiverId: receiverId,
      status: "accepted",
    });

    if (!success) {
      return {
        success: false,
        errorMessage: errorMessage || "Failed to accept friend request.",
      };
    }

    // 新增好友資訊到 friends 表
    await insertFriend({
      userId: senderId,
      friendId: receiverId,
    });

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      errorMessage: "An error occurred. Please try again later.",
    };
  }
};

// 拒絕交友邀請
export const rejectedFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps): Promise<Result> => {
  try {
    const { success, errorMessage } = await updateFriendRequestStatus({
      senderId,
      receiverId,
      status: "rejected",
    });

    if (!success) {
      return {
        success: false,
        errorMessage: errorMessage || "Failed to reject the friend request.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      errorMessage: "An error occurred. Please try again later.",
    };
  }
};

//刪除(單一)好友
export const deleteFriend = async ({
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
      console.error("Error deleting friend:", error);
      return { success: false, errorMessage: "Failed to delete friend." };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteFriend error:", error);
    return { success: false, errorMessage: "An error occurred." };
  }
};
