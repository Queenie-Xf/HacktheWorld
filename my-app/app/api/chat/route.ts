// 文件路径: app/api/chat/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai';
// 👇 引用刚才分开写的 prompt
import { PROMPT_ROLE_A, PROMPT_ROLE_B } from './prompts'; 

// 1. 初始化
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const zhipu = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // A. 查找会话 & 判断状态
    let conversationId;
    let userProfile = null;
    let systemPrompt = "";
    let currentMode = "A"; // 默认为 A (破冰)

    const { data: existingConvo } = await supabase
      .from('conversations')
      .select('id, metadata')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingConvo) {
      conversationId = existingConvo.id;
      if (existingConvo.metadata?.saved_profile) {
        userProfile = existingConvo.metadata.saved_profile;
      }
    } else {
      const { data: newConvo, error } = await supabase
        .from('conversations')
        .insert([{ user_id: userId, title: '成长探索', metadata: {} }])
        .select()
        .single();
      if (error) throw error;
      conversationId = newConvo.id;
    }

    // B. 核心分流逻辑 (Role A vs Role B)
    if (userProfile) {
      // 🔵 模式 B: 纯聊天
      currentMode = "B";
      systemPrompt = PROMPT_ROLE_B.replace('{{USER_PROFILE}}', JSON.stringify(userProfile));
    } else {
      // 🟢 模式 A: 破冰套话
      currentMode = "A";
      systemPrompt = PROMPT_ROLE_A;
    }

    // C. 组装历史消息
    const { data: historyMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10); 

    const contextMessages = (historyMessages || []).map(msg => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    // D. 调用 LLM
    // 先存用户消息
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    });

    const completion = await zhipu.chat.completions.create({
      model: "glm-4",  
      messages: [
        { role: "system", content: systemPrompt },
        ...contextMessages, 
        { role: "user", content: message }
      ] as any[], 
      temperature: 0.8, 
    });

    const aiRawContent = completion.choices[0].message.content || "";
    let finalUserMessage = aiRawContent;

    // E. Role A 特有的后处理 (提取 Profile)
    // Role B 不需要做任何 JSON 处理，它只负责说话
    if (currentMode === "A") {
      const jsonMatch = aiRawContent.match(/```json([\s\S]*?)```/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedData = JSON.parse(jsonMatch[1]);
          if (parsedData.user_profile) {
            
            // 1. 存入 Profiles 表
            await supabase
               .from('profiles')
               .upsert({
                 id: userId,
                 attributes: parsedData.user_profile,
                 updated_at: new Date().toISOString()
               }, { onConflict: 'id' });

            // 2. 更新 Conversations 状态
            await supabase
              .from('conversations')
              .update({
                metadata: { 
                  saved_profile: parsedData.user_profile,
                  status: 'onboarding_completed' 
                }
              })
              .eq('id', conversationId);

            // 3. 这里的 JSON 不展示给用户，切掉
            finalUserMessage = aiRawContent.replace(jsonMatch[0], '').trim();
          }
        } catch (e) {
          console.error("Role A JSON Error:", e);
        }
      }
    }

    // F. 存入 AI 回复
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'ai',
      content: finalUserMessage 
    });

    return NextResponse.json({
      success: true,
      data: finalUserMessage,
      conversationId
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}