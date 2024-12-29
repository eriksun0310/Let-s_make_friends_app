import dayjs from "dayjs";
import { User } from "../types";

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

// 計算星座(birthDate:2020-03-10)
export const getZodiacSign = (birthDate: string): string => {
  const date = new Date(birthDate);
  const month = date.getUTCMonth() + 1; // 月份從0開始，所以加1
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "牡羊座";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "金牛座";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "雙子座";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "巨蟹座";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "獅子座";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "處女座";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "天秤座";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "天蠍座";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "射手座";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "摩羯座";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "水瓶座";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "雙魚座";
  } else {
    return "無效的日期";
  }
};

// 檢查必填項目
export const checkRequired = (user: User) => {
  let isRequired = false;
  if (user.name && user.birthday && user.gender && user.headShot.imageUrl) {
    return {
      isRequired: true,
      requiredText: "",
    };
  } else if (!user.headShot.imageUrl) {
    return {
      isRequired: false,
      requiredText: "請選擇大頭貼",
    };
  }
  return {
    isRequired: isRequired,
    requiredText: "請填寫必填項目",
  };
};

// 格式化時間
export const formatTimeWithDayjs = (isoString: Date) => {
  const formattedTime = dayjs(isoString).format("A hh:mm");
  return formattedTime.replace("AM", "上午").replace("PM", "下午");
};
