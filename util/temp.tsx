 // 用戶資料（保持不變）
 "users": {
    "A1": {
      "userId": "A1",
      "name": "User A1",
      "gender": "female",
      "introduce": "Hi, I'm A1",
      "headShot": {
        "imageUrl": "",
        "imageType": "people"
      },
      "selectedOption": {
        "interests": [],
        "favoriteFood": [],
        "dislikedFood": []
      },
      "birthday": "",
      "email": "",
      "isPublic": true
    },
    // ... A2, A3, A4 的資料
  },
  // 好友關係（保持不變）
  "friendships": {
    "A1": {
      "friends": {
        "A2": {
          "status": "friends",
          "since": "2024-11-10T08:00:00Z"
        }
      }
    },
    "A2": {
      "friends": {
        "A1": {
          "status": "friends",
          "since": "2024-11-10T08:00:00Z"
        }
      }
    }
  },
  // 好友請求（保持不變）
  "friendRequests": {
    "request1": {
      "senderId": "A3",
      "receiverId": "A1",
      "status": "pending",
      "timestamp": "2024-11-10T09:00:00Z"
    }
  },