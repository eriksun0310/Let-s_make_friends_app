import { database } from "./firebaseConfig";
import { get, ref, set, update } from "firebase/database";

// 用於管理好友請求的 Firebase 參考路徑
const friendRequestsRef = ref(database, "friendRequests");

/*
總共有四個用戶 A1、A2 、A3 、A4  
1. A1 跟A2 互為好友 
2.A3 寄好友邀請給A1,A1 的好友確認頁看得到A3送的邀請, 也看得到A3的個人資訊  
3.A1 在加好友頁可以看到A4 (看不到 A2 A3) 而A4 可以看到A1、A2 、A3  
4.A1的好友列表有A2 , A2的好友列表有A1
*/
// 1. 查詢 A1 和 A2 的好友關係

// 查詢所有用戶(排除掉自己)
export const getAllUsers = async (currentUserId: string) => {
  const usersRef = ref(database, "users");
  const snapshot = await get(usersRef);

  if (snapshot.exists()) {
    const allUsers = snapshot.val();

    // 移除掉自己
    const filterUsers = Object.keys(allUsers)
      .filter((userId) => userId !== currentUserId)
      .reduce((result, userId) => {
        result[userId] = allUsers[userId];
        return result;
      }, {});

    return filterUsers;
  }
  return {};
};

// 發送好友邀請
export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  // A1 寄好友邀請給 A2
  // friendRequests 的資料結構如下:
  // {
  //   "requestId": {
  //     "senderId": "senderId", A1  a6ajkChLx6Xv7OSxjsEnL6VNYVJ2
  //     "receiverId": "receiverId", A2 B1DSzr0OjoNoB1dO5Q4faOb1VS93
  //     "status": "pending", // pending:待處理, accepted:已接受, rejected:已拒絕
  //     "createdAt": "建立時間戳"
  //   }
  // }
  const requestId = `${senderId}_${receiverId}_${Date.now()}`; // 產生唯一的請求ID

  const newRequest = {
    senderId,
    receiverId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  // 更新 Firebase 數據庫
  await set(ref(database, `friendRequests/${requestId}`), newRequest);
  return { success: true, requestId };
};

// 取得好友資訊
export const getSenderFriendData = async (friendId) => {
  console.log("friendId", friendId);
  const userRef = ref(database, `users/${friendId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

const checkFriendship = async (userId1, userId2) => {
  const friendshipRef = firebase
    .firestore()
    .collection("friendships")
    .doc(userId1);

  const doc = await friendshipRef.get();
  if (doc.exists) {
    return doc.data().friends?.[userId2]?.status === "friends";
  }
  return false;
};

// 2. 查詢 A1 的待處理好友請求（包括 A3 的請求）
const getPendingRequests = async (userId) => {
  const requestsRef = firebase.firestore().collection("friendRequests");

  const requests = await requestsRef
    .where("receiverId", "==", userId)
    .where("status", "==", "pending")
    .get();

  // 同時獲取發送請求者的資料
  const requestsWithUserInfo = await Promise.all(
    requests.docs.map(async (doc) => {
      const senderInfo = await firebase
        .firestore()
        .collection("users")
        .doc(doc.data().senderId)
        .get();

      return {
        ...doc.data(),
        senderInfo: senderInfo.data(),
      };
    })
  );

  return requestsWithUserInfo;
};

// 3. 獲取可以添加的好友列表（例如 A1 可以看到 A4）
const getAvailableUsers = async (userId) => {
  // 1. 獲取所有用戶
  const usersRef = firebase.firestore().collection("users");
  const allUsers = await usersRef.get();

  // 2. 獲取當前用戶的好友列表
  const friendshipsRef = firebase
    .firestore()
    .collection("friendships")
    .doc(userId);
  const friendships = await friendshipsRef.get();
  const friends = friendships.exists
    ? Object.keys(friendships.data().friends || {})
    : [];

  // 3. 獲取待處理的好友請求
  const requestsRef = firebase.firestore().collection("friendRequests");
  const sentRequests = await requestsRef.where("senderId", "==", userId).get();
  const receivedRequests = await requestsRef
    .where("receiverId", "==", userId)
    .get();

  // 整合所有不應該顯示的用戶ID
  const excludeIds = new Set([
    userId, // 自己
    ...friends, // 已經是好友的
    ...sentRequests.docs.map((doc) => doc.data().receiverId), // 已發送請求的
    ...receivedRequests.docs.map((doc) => doc.data().senderId), // 已收到請求的
  ]);

  // 過濾可用的用戶
  return allUsers.docs
    .filter((doc) => !excludeIds.has(doc.id))
    .map((doc) => doc.data());
};

// 4. 獲取好友列表（例如獲取 A1 的好友列表，會看到 A2）
const getFriendsList = async (userId) => {
  const friendshipsRef = firebase
    .firestore()
    .collection("friendships")
    .doc(userId);

  const doc = await friendshipsRef.get();
  if (!doc.exists) return [];

  const friendIds = Object.keys(doc.data().friends || {});

  // 獲取所有好友的詳細資料
  const friendsData = await Promise.all(
    friendIds.map((friendId) =>
      firebase
        .firestore()
        .collection("users")
        .doc(friendId)
        .get()
        .then((doc) => doc.data())
    )
  );

  return friendsData;
};
