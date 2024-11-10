//快速載入聊天室列表
// 不使用 userChatRooms 時，需要遍歷所有聊天室
firebase
  .database()
  .ref("chatRooms")
  .once("value")
  .then((snapshot) => {
    snapshot.forEach((room) => {
      if (room.val().participants.includes(currentUserId)) {
        // 找到用戶參與的聊天室
      }
    });
  });

// 使用 userChatRooms 時，可以直接獲取
firebase
  .database()
  .ref(`userChatRooms/${currentUserId}`)
  .once("value")
  .then((snapshot) => {
    // 直接獲得該用戶所有的聊天室
  });

//2.未讀訊息計數

// 從 userChatRooms 可以直接獲取未讀數
const unreadCount = firebase
  .database()
  .ref(`userChatRooms/${currentUserId}/${roomId}/unreadCount`);

// 當有新訊息時更新未讀數
function onNewMessage(roomId, messageData) {
  if (messageData.senderId !== currentUserId) {
    firebase
      .database()
      .ref(`userChatRooms/${currentUserId}/${roomId}/unreadCount`)
      .transaction((count) => (count || 0) + 1);
  }
}

//3.最後讀取時間追蹤

// 更新用戶最後讀取時間
function markRoomAsRead(roomId) {
  firebase.database().ref(`userChatRooms/${currentUserId}/${roomId}`).update({
    lastRead: firebase.database.ServerValue.TIMESTAMP,
    unreadCount: 0,
  });
}

//4.聊天室排序
// 根據最後讀取時間排序聊天室
firebase
  .database()
  .ref(`userChatRooms/${currentUserId}`)
  .orderByChild("lastRead")
  .once("value")
  .then((snapshot) => {
    // 獲得按時間排序的聊天室列表
  });
