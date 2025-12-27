// 文件路径: lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// 1. 这里的 URL 是对的
const supabaseUrl = 'https://bqzgdigtofzcbbweonan.supabase.co'

// 2. ⚠️ 注意：你的 Key 可能填错了！
// Supabase 的 anon key 通常是一长串以 "eyJh..." 开头的字符
// 你填写的 "sb_publishable..." 看起来像是别的 Key
// 请去 Supabase Dashboard -> Settings -> API 重新复制 "anon public" Key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxemdkaWd0b2Z6Y2Jid2VvbmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDczOTMsImV4cCI6MjA4MjM4MzM5M30.ocKgK6p9PdkkJJDvb9zjwgtaiOC81G_1bdGuesi35SY'

export const supabase = createClient(supabaseUrl, supabaseKey)