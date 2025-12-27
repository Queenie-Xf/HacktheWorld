// lib/aiService.ts
export type ChatMessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

interface CallGLMOptions {
  temperature?: number;
  top_p?: number;
  model?: string;
}

const LOCAL_GLM_ENDPOINT = "/api/ai-call";

export async function callGLM(
  messages: ChatMessage[],
  options?: CallGLMOptions,
): Promise<string> {
  try {
    const response = await fetch(LOCAL_GLM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        // 确保传递给后端时模型标识符为官方要求的小写
        options: {
          ...options,
          model: options?.model || "glm-4-plus"
        },
      }),
    });

    if (!response.ok) {
      return "GLM-4-plus 暂时无法响应，请稍后再试。";
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || data?.data?.[0]?.content;

    return content?.trim() || "我暂时没有回应，再试一次好吗？";
  } catch (error) {
    console.error("Failed to call GLM proxy:", error);
    return "调用 GLM-4-plus 时遇到问题，请稍后重试。";
  }
}