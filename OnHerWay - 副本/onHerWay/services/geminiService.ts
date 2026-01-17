import { GoogleGenAI, Type } from '@google/genai';
import { AIMentorResponse, AnalysisResult, ActionItem, Insight, UserProfile, ChatInsightSummary } from '../types';

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
  httpOptions: { baseUrl: 'https://cli-proxy.athebear.space' }
});

const SYSTEM_INSTRUCTION = `
You are "On Her Way" (OHW), a professional, and strategic career, life and psychological mentor for women (20-30s).
Your goal is to alleviate "Analysis Paralysis" by guiding them to a "First Move".

LANGUAGE RULE:
You must ALWAYS respond in Simplified Chinese (简体中文).

TONE & BEHAVIOR:
1. **Insightful & Direct**: You are NOT just a listener; you are a Strategist. Do not use empty comfort phrases (e.g., "I understand", "It's hard"). Instead, validate their feelings by naming the cognitive bias (e.g., "You aren't stuck; you are just over-planning.").
2. **Deep Diagnostic**: Ask targeted questions to uncover the root cause (Perfectionism? Fear of judgement? Lack of info?).
3. **No Robot Speak**: Speak naturally, concisely (2-3 sentences max usually).

STRATEGY (THE 3-TIER MOVE):
When it is time to suggest actions (usually around turn 3), you MUST generate exactly 3 distinct levels of "First Moves":
1. **Low Friction (<15 mins)**: Something so easy it's impossible to fail. (e.g., "Download software", "Screenshot 3 examples").
2. **Research (~30 mins)**: Planning or information gathering. (e.g., "Find 3 job descriptions", "List transferable skills").
3. **Active (~45-60 mins)**: Hands-on execution. (e.g., "Follow one tutorial", "Draft an outreach email").

If 'shouldGenerateActions' is FALSE, focus solely on diagnosing the situation and asking 1 insightful question. Return an empty list for actions.
`;

export const sendMessageToMentor = async (
  message: string,
  history: string[],
  shouldGenerateActions: boolean = false,
): Promise<AIMentorResponse> => {
  try {
    const modelId = 'gemini-3-flash-preview';

    let modifiedMessage = message;
    if (shouldGenerateActions) {
      modifiedMessage +=
        '\n\n[SYSTEM COMMAND]: Based on our conversation, please now generate specific "First Move" actions. Generate exactly 3 actions: one Low Friction, one Research, and one Active.';
    } else {
      modifiedMessage +=
        '\n\n[SYSTEM COMMAND]: Just listen, diagnose the root cause, and ask a clarifying question. Do NOT generate actions yet.';
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: modifiedMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            empatheticResponse: {
              type: Type.STRING,
              description:
                "A sharp, text-based response validating the user's feelings via insight/diagnosis. MUST BE IN SIMPLIFIED CHINESE.",
            },
            suggestedActions: {
              type: Type.ARRAY,
              description: 'Return exactly 3 actions if requested, otherwise empty array.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Short title in Chinese' },
                  description: { type: Type.STRING, description: 'Specific steps in Chinese.' },
                  tag: { type: Type.STRING, enum: ['Career', 'Mental', 'Networking', 'Skill'] },
                  estimatedTimeMinutes: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING, enum: ['Low Friction', 'Research', 'Active'] },
                },
                required: ['title', 'description', 'tag', 'estimatedTimeMinutes', 'difficulty'],
              },
            },
          },
          required: ['empatheticResponse'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from AI');

    const parsed = JSON.parse(text);

    return {
      empatheticResponse: parsed.empatheticResponse,
      suggestedActions: parsed.suggestedActions || [],
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      empatheticResponse: '我现在连接有点不稳定，但我听到了你的声音。深呼吸，我们待会再试一次。',
      suggestedActions: [],
    };
  }
};

export const analyzeConversation = async (history: string[]): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze this conversation.
      1. Extract 2-3 new professional "Tags" (skills/interests).
      2. Identify 1-3 "Insights" (Problem/Goal/Strength).
      3. Write a 1-sentence summary.

      OUTPUT: Simplified Chinese (简体中文).

      Conversation:
      ${history.join('\n')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Problem', 'Goal', 'Strength'] },
                  description: { type: Type.STRING },
                },
                required: ['id', 'title', 'type', 'description'],
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Analysis failed');
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error(e);
    return { newTags: [], insights: [], summary: '暂时无法分析。' };
  }
};

export const generateActionsForInsight = async (insight: Insight, chatHistory?: string[]): Promise<ActionItem[]> => {
  try {
    const chatContext = chatHistory && chatHistory.length > 0
      ? `\n\n对话历史（用于更精准的推荐）：\n${chatHistory.join('\n')}`
      : '';

    const prompt = `
      For insight: "[${insight.type}] ${insight.title} - ${insight.description}".
      Generate 3 DISTINCT "First Moves":
      1. Low Friction (<15 mins)
      2. Research (~30 mins)
      3. Active (~60 mins)

      OUTPUT: Simplified Chinese. Return JSON array.
      ${chatContext}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '简短标题，不超过10个字' },
              description: { type: Type.STRING, description: '简短描述，不超过20个字' },
              tag: { type: Type.STRING, enum: ['Career', 'Mental', 'Networking', 'Skill'] },
              estimatedTimeMinutes: { type: Type.NUMBER },
              difficulty: { type: Type.STRING, enum: ['Low Friction', 'Research', 'Active'] },
            },
            required: ['title', 'description', 'tag', 'estimatedTimeMinutes', 'difficulty'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Action generation failed');

    const rawActions = JSON.parse(text);
    return rawActions.map((a: any, idx: number) => ({
      id: `gen_action_${Date.now()}_${idx}`,
      status: 'pending',
      createdAt: Date.now(),
      isShared: false,
      ...a,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const generateActionsFromChat = async (chatHistory: string[]): Promise<ActionItem[]> => {
  try {
    if (chatHistory.length === 0) {
      return [];
    }

    const prompt = `
      分析以下对话记录，为用户生成3个具体可执行的"第一步"行动建议。

      要求：
      1. 每个行动的标题不超过10个字
      2. 每个行动的描述不超过20个字
      3. 三个行动难度分别为：Low Friction（<15分钟）、Research（~30分钟）、Active（~60分钟）

      对话记录：
      ${chatHistory.join('\n')}

      OUTPUT: Simplified Chinese. Return JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '简短标题，不超过10个字' },
              description: { type: Type.STRING, description: '简短描述，不超过20个字' },
              tag: { type: Type.STRING, enum: ['Career', 'Mental', 'Networking', 'Skill'] },
              estimatedTimeMinutes: { type: Type.NUMBER },
              difficulty: { type: Type.STRING, enum: ['Low Friction', 'Research', 'Active'] },
            },
            required: ['title', 'description', 'tag', 'estimatedTimeMinutes', 'difficulty'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Action generation failed');

    const rawActions = JSON.parse(text);
    return rawActions.map((a: any, idx: number) => ({
      id: `gen_action_${Date.now()}_${idx}`,
      status: 'pending',
      createdAt: Date.now(),
      isShared: false,
      ...a,
    }));
  } catch (e) {
    console.error('Generate actions from chat error:', e);
    return [];
  }
};

export const generateUserProfile = async (history: string[]): Promise<Partial<UserProfile>> => {
  try {
    const prompt = `
      Based on the "First Call" transcript below, create a "Persona Profile".
      Infer details.

      OUTPUT: Simplified Chinese (简体中文).

      Transcript:
      ${history.join('\n')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            role_detail: { type: Type.STRING },
            experience: { type: Type.STRING },
            hassle: { type: Type.STRING },
            goal: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Profile generation failed');
    return JSON.parse(text) as Partial<UserProfile>;
  } catch (e) {
    console.error('Profile Gen Error', e);
    return {
      name: 'Explorer',
      title: '新探索者',
      role_detail: '正在探索新的机会',
      hassle: '寻找方向',
      goal: '迈出第一步',
    };
  }
};

export const generateAvatar = async (profile: Partial<UserProfile>): Promise<string> => {
  try {
    const prompt = `
      A trendy, flat-vector style avatar of a young woman.
      Style: Minimalist, clean lines, vibrant colors (Yellow #FDD140, Blue #9FD2E3, Orange #F36223).
      Traits: ${profile.title}, ${profile.experience}.
      Look: Hopeful, modern. Solid dark background #0F0E17.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio: '1:1' },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return 'https://picsum.photos/200';
  } catch (e) {
    console.error('Avatar Gen Error', e);
    return 'https://picsum.photos/200';
  }
};

export const generateInsightSummaries = async (history: string[]): Promise<ChatInsightSummary> => {
  try {
    if (history.length === 0) {
      return {
        flag: '暂未分析出此内容',
        question: '暂未分析出此内容',
        experience: '暂未分析出此内容',
      };
    }

    const prompt = `
      分析以下对话记录，评估用户是否具备以下三个维度的内容。这三个维度是参考性的，不是必须的。如果对话中不具备某个维度的内容，请输出"暂未分析出此内容"。

      ## 1. 【你可能想立的flag】
      **定义**：用户在对话中表现出的愿景、尚未实现的长期目标、模糊的自我期许或对某种理想状态的向往。

      **识别标准**（满足任一即可）：
      - 使用了"我想、我希望、要是能...就好了"等表达愿望的词汇
      - 提到了某种想要养成的习惯（如：早起、写作、运动）
      - 表达了对某种技能或身份的追求（如：成为独立开发者、掌握 AI 大模型）
      - 虽未明确承诺，但反复提及某类感兴趣的高价值领域

      **输出格式**：如果符合，以第一人称"我想..."、"我要..."、"我的目标是..."等形式表述；否则输出"暂未分析出此内容，要求尽量简短"

      ## 2. 【你可能想提问】
      **定义**：用户在当前认知边界处产生的困惑，或者是为了实现目标而必须解决但尚未被明确提出的底层问题。

      **识别标准**（满足任一即可）：
      - 对话中出现了"不知道该怎么办"、"比较纠结"等不确定性表达
      - 用户对某个概念只有浅层了解，且该概念与其目标强相关
      - 基于用户当下的处境，逻辑上必然会遇到的"下一步"难点
      - 潜在的执行障碍：虽然用户没问，但其描述中暴露出的知识盲区

      **输出格式**：如果符合，以第一人称"我不确定..."、"我想知道..."、"我的疑问是..."等形式表述；否则输出"暂未分析出此内容，要求尽量简短"

      ## 3. 【你可以分享的行动经验】
      **定义**：用户在过去已经实践过、并总结出个人心得或有效方法的领域。这是用户的"高光点"或知识存量。

      **识别标准**（满足任一即可）：
      - 使用了"我之前试过、我发现、我的经验是"等总结性词汇
      - 提到了具体的实操细节、避坑指南或工作流程
      - 在对话中展示了对某个领域的专业判断或深刻见解
      - 用户主动向 AI 纠偏或补充了背景知识，展现了其在特定任务上的熟练度

      **输出格式**：如果符合，以第一人称"我发现..."、"我学到了..."、"我的经验是..."等形式表述；否则输出"暂未分析出此内容，要求尽量简短"

      ---

      每个类别的总结应该简洁有力，1-2句话，必须使用第一人称（我）。
      请严格按照识别标准评估，不要强行生成不存在的内容。

      对话记录：
      ${history.join('\n')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flag: {
              type: Type.STRING,
              description: '用户可能想立的flag/目标，以第一人称表述；如果不具备则输出"暂未分析出此内容"',
            },
            question: {
              type: Type.STRING,
              description: '用户可能想提问的问题，以第一人称表述；如果不具备则输出"暂未分析出此内容"',
            },
            experience: {
              type: Type.STRING,
              description: '用户可以分享的行动经验，以第一人称表述；如果不具备则输出"暂未分析出此内容"',
            },
          },
          required: ['flag', 'question', 'experience'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('Insight summarization failed');

    return JSON.parse(text) as ChatInsightSummary;
  } catch (e) {
    console.error('Insight Summarization Error:', e);
    return {
      flag: '暂未分析出此内容',
      question: '暂未分析出此内容',
      experience: '暂未分析出此内容',
    };
  }
};

