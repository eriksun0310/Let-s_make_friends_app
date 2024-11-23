import { supabase } from "./supabaseClient";

interface FriendProps {
  senderId: string;
  receiverId: string;
}

/*
總共有四個用戶 A1、A2 、A3 、A4  
1. A1 跟A2 互為好友 
2.A3 寄好友邀請給A1,A1 的好友確認頁看得到A3送的邀請, 也看得到A3的個人資訊  
3.A1 在加好友頁可以看到A4 (看不到 A2 A3) 而A4 可以看到A1、A2 、A3  
4.A1的好友列表有A2 , A2的好友列表有A1
*/
// 1. 查詢 A1 和 A2 的好友關係

// 取得可以成為好友的用戶
export const getAllUsers = async (currentUserId: string) => {
  try {
    // 取得已發送的好友邀請對象
    // const { data: sentRequests, error: sentRequestsError } = await supabase
    //   .from("friend_requests")
    //   .select("receiver_id") // 查詢接收者的 ID
    //   .eq("sender_id", currentUserId); // 只查詢當前用戶發送的邀請

    const { data: friendRequests, error: friendRequestsError } = await supabase
      .from("friend_requests")
      .select("sender_id, receiver_id")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`); // 同時過濾 sender 和 receiver

    if (friendRequestsError) {
      console.error("Error fetching friend requests:", friendRequestsError);
      return [];
    }

    // 整理需要排除的用戶 ID
    const excludeUserIds = friendRequests.flatMap((req) => [
      req.sender_id,
      req.receiver_id,
    ]);

    // 整理已發送好友邀請的 userId
    // const sentRequestIds = sentRequests.map((req) => req.receiver_id);

    // // 查詢 `users` 表，排除自己的資料和已發送好友邀請的用戶
    // const { data: usersData, error: usersError } = await supabase
    //   .from("users")
    //   .select(
    //     "id, name, gender, introduce, birthday, email, created_at, updated_at"
    //   )
    //   .neq("id", currentUserId) // 排除自己的 userId
    //   .not("id", "in", `(${sentRequestIds.join(",")})`); // 排除已發送好友邀請的用戶

    // 查詢 `users` 表，排除自己和所有已經有好友邀請關係的用戶
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select(
        "id, name, gender, introduce, birthday, email, created_at, updated_at"
      )
      .neq("id", currentUserId) // 排除自己的 userId
      .not("id", "in", `(${excludeUserIds.join(",")})`); // 排除所有與好友邀請相關的用戶

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return [];
    }

    // 查詢 `user_head_shot` 表的必要欄位
    const { data: headShotsData, error: headShotsError } = await supabase
      .from("user_head_shot")
      .select("user_id, image_url, image_type"); // 指定需要的欄位

    if (headShotsError) {
      console.error("Error fetching user headshots:", headShotsError);
    }

    // 查詢 `user_selected_option` 表的必要欄位
    const { data: selectedOptionsData, error: selectedOptionsError } =
      await supabase
        .from("user_selected_option")
        .select("user_id, interests, favorite_food, disliked_food"); // 指定需要的欄位

    if (selectedOptionsError) {
      console.error(
        "Error fetching user selected options:",
        selectedOptionsError
      );
    }

    // 整合三張表的資料
    const allUsers = usersData.map((user) => {
      // 找到對應的頭像資料
      const headShot = headShotsData?.find((h) => h.user_id === user.id) || {
        image_type: "",
        image_url: "",
      };

      // 找到對應的選項資料
      const selectedOption = selectedOptionsData?.find(
        (s) => s.user_id === user.id
      ) || {
        interests: [],
        favorite_food: [],
        disliked_food: [],
      };

      return {
        userId: user.id,
        name: user.name,
        gender: user.gender,
        introduce: user.introduce,
        birthday: user.birthday,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        headShot: {
          imageUrl: headShot.image_url || null,
          imageType: headShot.image_type || null,
        },
        selectedOption: {
          interests: selectedOption.interests || [],
          favoriteFood: selectedOption.favorite_food || [],
          dislikedFood: selectedOption.disliked_food || [],
        },
      };
    });

    // 返回整合後的用戶陣列
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
}: FriendProps) => {
  try {
    const { error } = await supabase.from("friend_requests").insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });
    if (error) {
      console.error("Error sending friend request:", error);
      return {
        success: false,
        message: "Failed to send friend request. Please try again later.",
      };
    }

    return { success: true, message: "Friend request sent successfully!" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
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
}) => {
  // 更新 friend_requests 狀態
  const { error } = await supabase
    .from("friend_requests")
    .update({
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId);

  if (error) {
    console.error("Error updating friend request status:", error);
    return { success: false, message: error };
  }

  return {
    success: true,
  };
};

// 取得好友列表
const getFriendList = async (currentUserId: string) => {
  
};

// 新增 好友資訊到 friends 表
const insertFriend = async ({ userId, friendId }:{
  userId: string;
  friendId: string;
}) => {
  try {
    // 插入 user_id 和 friend_id 的關聯
    const { error: insertError1 } = await supabase.from("friends").insert({
      user_id: userId,
      friend_id: friendId,
    });
    if (insertError1) {
      console.error("Error inserting friend record 1:", insertError1);
      throw insertError1; // 拋出錯誤
    }

    // 插入反向關聯 friend_id 和 user_id 的關聯
    const { error: insertError2 } = await supabase.from("friends").insert({
      user_id: friendId,
      friend_id: userId,
    });

    if (insertError2) {
      console.error("Error inserting friend record 2:", insertError2);
      throw insertError2; // 拋出錯誤
    }

    console.log("Friendship successfully added!");
  } catch (error) {
    console.error("Error inserting friend:", error);
  }
};

// 確認交友邀請
export const confirmFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps) => {
  try {
    const { success, message } = await updateFriendRequestStatus({
      senderId: senderId,
      receiverId: receiverId,
      status: "accepted",
    });

    if (!success) {
      return {
        success: false,
        message: message || "Failed to accept friend request.",
      };
    }

    // 新增好友資訊到 friends 表
    await insertFriend({
      userId: senderId,
      friendId: receiverId,
    });

    return { success: true, message: "Friend request accepted successfully!" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
};

// 拒絕交友邀請
export const rejectFriendRequest = async ({
  senderId,
  receiverId,
}: FriendProps) => {
  try {
    const { success, message } = await updateFriendRequestStatus({
      senderId,
      receiverId,
      status: "rejected",
    });

    if (!success) {
      return {
        success: false,
        message: message || "Failed to reject the friend request.",
      };
    }

    return { success: true, message: "Friend request rejected successfully!" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
};

// 取得寄出交友邀請的 好友資訊(單一)
export const getSenderFriendData = async (friendId: string) => {
  console.log("friendId 1111111", friendId);

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
    return [];
  }

  console.log("data  ===>111111", data);

  return {
    userId: data.id,
    name: data.name,
    gender: data.gender,
    introduce: data.introduce,
    birthday: data.birthday,
    email: data.email,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    headShot: {
      imageUrl: data.user_head_shot?.image_url || null,
      imageType: data.user_head_shot?.image_type || null,
    },
    selectedOption: {
      interests: data.user_selected_option?.interests || [],
      favoriteFood: data.user_selected_option?.favorite_food || [],
      dislikedFood: data.user_selected_option?.disliked_food || [],
    },
  };
};
