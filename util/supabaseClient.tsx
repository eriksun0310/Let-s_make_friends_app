import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABSEURL, SUPABSEKEY } from "@env";
// const supabaseUrl = SUPABSEURL; // 替換為你的 Supabase URL
// const supabaseKey = SUPABSEKEY; // 替換為你的 Supabase 匿名 API 金鑰

// console.log('supabaseUrl', supabaseUrl)
// console.log('SUPABSEKEY',SUPABSEKEY)
export const supabase = createClient(SUPABSEURL, SUPABSEKEY, {
  auth: {
    storage: AsyncStorage, // 使用 AsyncStorage 來儲存登入資料, 是RN 環境中必要的設置
    autoRefreshToken: true, // 自動刷新 token
    persistSession: true, // 持久化 session(對於保持用戶登入狀態的需求)
    detectSessionInUrl: false, // 不自動從 URL 中檢查登入狀態
  },
});
