## 這是一款主打 資訊自主權 的交友 App —— 使用者可以自由決定「誰能看到什麼」、「是否曝光互動數據」，打造一個安全、無壓力、無演算法干擾的交友空間。


## 🛠 技術棧
| 分類    | 使用技術                                      |
| ----- | ----------------------------------------- |
| 前端    | React Native + Expo                       |
| 狀態管理  | React Context + 自訂 Hooks                  |
| 後端服務  | Supabase（PostgreSQL / Auth / Realtime）    |
| 會員系統  | Supabase Auth（Email 註冊／登入）                |
| 導航    | React Navigation                          |
| UI 樣式 | Styled Components / Tailwind React Native |



## 技術採用 React Native + Supabase，支援跨平台與即時資料互動，核心功能包括：

🧑‍🤝‍🧑 好友邀請與管理（非好友無法互動）

📝 發文與自訂權限（公開／好友可見）

💬 僅限好友之間的一對一聊天室

🔐 多種隱私開關：隱藏已讀、按讚、留言數

🏷️ 自訂標籤與搜尋功能，讓內容更易探索

🛡️ 所有貼文的可見權限僅作者本人可知，其他使用者不會知道這篇文章是開給誰看的，避免社交壓力與尷尬。

📌 專案理念
希望成為「慢社交、重隱私」的交友平台，讓使用者可以不受演算法干擾，也不需過度暴露個人資訊，逐步建立真實連結。





## 🔐 會員系統（註冊 / 登入）
</br>使用 Supabase Auth 實作的會員系統，支援 Email 註冊與登入，搭配登入保護機制，保障使用者隱私與操作體驗。</br>
<img src="images/會員登入.jpg" width="300"/>
<img src="images/會員註冊.jpg" width="300"/>




## 👤 個人資料管理
</br>編輯名稱、自我介紹、性別、生日、星座、興趣、喜好食物與頭貼</br>
<img src="images/個人資料管理.jpg" width="300"/>
<img src="images/個人資料.jpg" width="300"/>
</br>編輯大頭貼</br>
<img src="images/大頭貼更換.jpg" width="300"/>



## 🤝 好友系統</br>
</br>📩 加好友與邀請機制</br>
</br>✅雙方都同意後才會成為好友</br>
<img src="images/加好友.jpg" width="300"/>
<img src="images/好友邀請.jpg" width="300"/>
</br>✅ 好友列表僅自己可見，他人無法看到你加了誰</br>
</br>✅ 僅限雙方互為好友後，才能啟動聊天功能，避免陌生騷擾</br>
<img src="images/好友列表.jpg" width="300"/>
<img src="images/刪除好友.jpg" width="300"/></br>



## 📝 發文章</br>
</br>首頁僅顯示使用者有權限觀看的文章內容</br>
</br>👀 如果是「公開文章」，所有使用者都能看見</br>
</br>🔒 如果是「僅限好友」，只有文章作者的好友會在首頁看到</br>
</br>❗其他使用者無法得知該文章的存在，也不會看到任何權限提示</br>
</br>✅ 只有貼文作者本人能看到這篇貼文的權限設定</br>
<img src="images/首頁.jpg" width="300"/>
</br>❌ 對於其他人的文章上不會顯示是「公開」或「限好友」，以保護作者的選擇與隱私</br>
</br>📌 此設計避免社交尷尬與標籤化，讓使用者能安心分享，不怕被「分級對待」引起誤會</br>
<img src="images/其他使用者看的首頁.jpg" width="300"/>
</br>新增文章時可自訂 多個標籤（Tags），方便他人透過標籤搜尋貼文</br>
<img src="images/新增文章FAB.jpg" width="300"/>
<img src="images/新增文章.jpg" width="300"/>


## 🔐 用戶隱私設定
</br>✅ 關閉聊天室已讀標記：關閉後，對方無法得知訊息是否已讀，讓對話壓力更低</br>
</br>✅ 隱藏貼文的按讚數：貼文發出後，其他人無法看到按讚數字，避免社交焦慮與比較</br>
</br>✅ 隱藏貼文的留言數：僅保留內容本身，移除「熱度」干擾，聚焦交流本質</br>
<img src="images/設定.jpg" width="300"/>



## 💬 聊天室功能
</br>✅一對一聊天僅在雙方為好友後才啟用</br>
</br>🛠 以 Supabase Realtime 建立訊息即時同步</br>
<img src="images/聊天室列表.jpg" width="300"/>
<img src="images/刪除聊天室.jpg" width="300"/>
<img src="images/聊天室.jpg" width="300"/>



