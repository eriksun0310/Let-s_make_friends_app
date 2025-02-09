export const formatTimeAgo = (createdAt: string | Date): string => {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - createdTime) / (1000 * 60)); // 計算分鐘數

  if (diffMinutes < 1) return "剛剛"; // 少於 1 分鐘
  if (diffMinutes < 60) return `${diffMinutes} 分鐘前`; // 少於 60 分鐘
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} 小時前`; // 少於 24 小時
  return `${Math.floor(diffMinutes / 1440)} 天前`; // 超過 1 天
};
