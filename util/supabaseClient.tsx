import { createClient } from "@supabase/supabase-js";
import { SUPABSEURL, SUPABSEKEY } from "@env";
// const supabaseUrl = SUPABSEURL; // 替換為你的 Supabase URL
// const supabaseKey = SUPABSEKEY; // 替換為你的 Supabase 匿名 API 金鑰


// console.log('supabaseUrl', supabaseUrl)
// console.log('SUPABSEKEY',SUPABSEKEY)
export const supabase = createClient(SUPABSEURL, SUPABSEKEY);
