# 社交平台數據結構分析

## 1. 好友關係 (user-friends)
```
"user-friends": {
  "123": {
    "456": true
  }
}
```
- 雙向好友關係設計正確
- 優點：查詢效率高，容易維護好友狀態
- 建議：可以考慮添加好友狀態欄位，例如 pending/accepted/blocked

## 2. 文章可見度控制 (post-privacy)
```
"post-privacy": {
  "friends-only": {
    "-postId123": true
  }
}
```
- 好處：快速過濾可見文章
- 建議擴展：
  - 可新增 "public" 和 "private" 節點
  - 考慮添加自定義好友名單可見度

## 3. 用戶文章索引 (user-posts)
```
"user-posts": {
  "123": {
    "-postId123": true
  }
}
```
- 優點：快速獲取特定用戶的所有文章
- 建議：可以考慮添加時間戳，方便分頁和時間排序

## 4. 用戶按讚記錄 (user-likes)
```
"user-likes": {
  "123": {
    "-postId123": true
  }
}
```
- 優點：方便查詢用戶互動過的內容
- 可擴展功能：
  - 添加時間戳記錄按讚時間
  - 實現"查看我按讚的文章"功能

## 5. 文章相關節點
### 文章基本信息 (posts)
```
"posts": {
  "-postId123": {
    "authorId": "123",
    "content": "大家好",
    "createdAt": 1698633600000,
    "privacy": "friends-only",
    "likeCount": 2,
    "commentCount": 1
  }
}
```
- 計數器設計合理
- 建議添加：
  - 文章類型 (純文字/圖片/影片)
  - 標籤 (hashtags)
  - 分享次數計數

### 文章留言 (post-comments)
```
"post-comments": {
  "-postId123": {
    "-commentId456": {
      "authorId": "456",
      "content": "嗨嗨",
      "createdAt": 1698633660000
    }
  }
}
```
- 建議添加：
  - 留言的按讚功能
  - 回覆留言功能
  - 留言提及功能 (@用戶)

### 文章按讚記錄 (post-likes)
```
"post-likes": {
  "-postId123": {
    "123": true,
    "456": true
  }
}
```
- 設計簡潔有效
- 建議：可添加按讚時間戳

## 查詢模式建議

### 首頁文章流查詢順序：
1. 獲取當前用戶好友列表 (user-friends)
2. 查詢好友可見文章 (post-privacy)
3. 根據時間排序
4. 批量獲取文章詳情 (posts)

### 個人主頁查詢：
1. 直接從 user-posts 獲取用戶所有文章ID
2. 根據權限過濾
3. 獲取文章詳情

### 互動提示查詢：
1. 從 post-likes 獲取文章按讚用戶
2. 與當前用戶好友列表交叉比對
3. 生成"xxx也喜歡這篇文章"提示

## 優化建議

1. 分頁優化：
   - 在 user-posts 中添加時間戳
   - 實現 cursor-based 分頁

2. 實時更新優化：
   - 可以新增 user-timeline 節點
   - 預先組合好友的最新文章

3. 快取策略：
   - 熱門文章可以快取
   - 好友列表可以快取

4. 擴展功能建議：
   - 文章分享功能
   - 文章收藏功能
   - 提及功能 (@用戶)
   - 主題標籤功能 (#話題)
