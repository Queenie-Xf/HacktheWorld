// 文件路径: app/api/generate-report/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai';

// ----------------------------------------------------------------------------
// 1. 配置区域
// ----------------------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const zhipu = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY,
});

// ----------------------------------------------------------------------------
// 2. Prompt 定义 (直接写在这里，无需 import)
// ----------------------------------------------------------------------------
const PROMPT_REPORT_GENERATOR = `
# Role: 社区内容结案官 (Community Content Strategist)

## Input Data
用户画像 (Profile): {{USER_PROFILE}}
完整对话记录 (History): {{CHAT_HISTORY}}

## Task
用户刚结束了一场心理/咨询对话。请基于对话内容，生成 **最多 3 个** 不同角度的“对话摘要卡片”。
这些卡片将帮助用户直接一键发帖求助，并提供行动指南和资源推荐。

## Output Structure (JSON Only)
必须输出且仅输出一个合法的 JSON 对象，包含 \`summaries\` 数组。
严禁输出任何 Markdown 标记（如 \`\`\`json），只输出纯 JSON 字符串。
结构如下：

{
  "summaries": [
    {
      "title": "摘要标题 (如：职场焦虑篇)",
      "post_draft": "（第一人称口吻，像小红书/朋友圈文案，包含问题、目标、经历，适合直接发帖）",
      "moves": [ 
        {
          "action_title": "行动简述 (如：修改简历Top3)",
          "action_detail": "具体执行步骤...",
          "resources": [ 
            {
              "title": "帖子标题 (如：HR看简历只看这三点)",
              "author": "博主ID",
              "reason": "推荐理由"
            },
            { ... }, { ... } // 该行动对应的 3 个推荐帖子
          ]
        },
        { ... }, { ... } // 该摘要对应的 3 个 moves
      ]
    },
    { ... } // 摘要2 (可选)
  ]
}

## Content Guidelines

### 1. 摘要 (Summaries) - 第一人称发帖风
生成 1-3 个不同侧重点的草稿。
- **Draft A (情绪版)**：侧重表达困惑，寻求共鸣。（如：“真的崩溃了，28岁裸辞是不是疯了...”）
- **Draft B (理性版)**：侧重解决问题，寻求建议。（如：“坐标上海，运营转产品，目前卡在...”）
- **Draft C (复盘版)**：如果用户已经很清晰，总结今天的收获。（如：“刚刚和AI聊完，梳理出这3个方向，大家帮我看看...”）

### 2. 行动 (Moves) - 强关联
基于之前的对话，提取或生成 **3 个** 最关键的 First Moves。
- 必须具体、可执行、低门槛。

### 3. 推荐资源 (Resources) - 模拟社区生态
对于每个行动，推荐 **3 个** 虚拟但真实感强的社区帖子。
- **Title**: 像爆款标题（如《这招绝了！》、《亲测有效》）。
- **Reason**: 一句话告诉用户为什么要看这个。
`;

// ----------------------------------------------------------------------------
// 3. 核心 API 逻辑
// ----------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // A. 获取完整对话记录
    const { data: messages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages found" }, { status: 404 });
    }

    // B. 获取用户 Profile (尝试从 conversations metadata 读取，如果没有则为空对象)
    const { data: conversation } = await supabase
      .from('conversations')
      .select('metadata')
      .eq('id', conversationId)
      .single();

    const userProfile = conversation?.metadata?.saved_profile || {};

    // C. 拼接 Prompt
    const historyText = messages.map(m => `${m.role === 'ai' ? 'AI' : 'User'}: ${m.content}`).join('\n');
    
    const finalPrompt = PROMPT_REPORT_GENERATOR
      .replace('{{USER_PROFILE}}', JSON.stringify(userProfile))
      .replace('{{CHAT_HISTORY}}', historyText);

    // D. 调用 LLM 生成报告
    const completion = await zhipu.chat.completions.create({
      model: "glm-4-plus",
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.7,
      // 强制让模型尽量只输出 JSON (部分模型支持 json_object 模式，GLM-4-plus 通用模式下靠 prompt 约束)
    });

    const aiContent = completion.choices[0].message.content || "";
    
    // E. 提取 JSON (增强鲁棒性)
    let reportJson = null;
    
    // 尝试匹配 ```json ... ``` 或直接解析
    const jsonMatch = aiContent.match(/```json([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1] : aiContent;

    try {
      reportJson = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // 如果解析失败，返回原始文本供前端调试，或者返回错误
      return NextResponse.json({ success: false, error: "Failed to generate valid report JSON", raw: aiContent }, { status: 500 });
    }

    // F. 存入数据库 (Reports 表)
    // ⚠️ 确保你在 Supabase 创建了 reports 表，且 content 字段类型为 JSONB
    const { data: savedReport, error: dbError } = await supabase
      .from('reports')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content: reportJson // 直接存入解析后的 JSON 对象
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      throw dbError;
    }

    return NextResponse.json({ success: true, data: savedReport });

  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
