// 處理 聊天室 db 操作(chat_rooms、messages)

// 取得所有聊天室
export const getAllChatRooms = async () => {};


// 建立新聊天室
export const createNewChatRoom = async (
  senderId: string,
  receiverId: string
) => {};


// 發送訊息
export const sendMessage = async (roomId: string, message: string) => {};

// 刪除聊天室
export const deleteChatRoom = async (roomId: string) => {};

// 刪除聊天紀錄
export const deleteChatHistory = async (roomId: string) => {};
