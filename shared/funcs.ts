// 計算年齡的函數
export const calculateAge = (date: Date | string) => {
  const today = new Date();
  const birthDate = new Date(date);

  // 判斷 birthDate 是否為有效日期
  if (isNaN(birthDate.getDate())) {
    return 0;
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--; // 如果生日還沒到，年齡減一
  }

  return age;
};
