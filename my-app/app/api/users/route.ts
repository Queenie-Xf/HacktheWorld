// 文件路径: app/api/users/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  // 查询数据库
  const { data, error } = await supabase.from('profiles').select('*');

  // 如果出错
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // 如果成功
  return NextResponse.json({
    success: true,
    message: "🎉 恭喜！数据库连接成功！",
    data: data
  });
}