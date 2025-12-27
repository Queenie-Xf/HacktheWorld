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
        options,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "GLM proxy request failed",
        response.status,
        errorText || "Unknown error",
      );
      return "GLM-4.7 暂时无法响应，请稍后再试。";
    }

    const data = await response.json();
    const content: string | undefined =
      data?.choices?.[0]?.message?.content || data?.data?.[0]?.content;

    if (!content || !content.trim()) {
      console.warn("GLM proxy response was empty.");
      return "我暂时没有回应，再试一次好吗？";
    }

    return content.trim();
  } catch (error) {
    console.error("Failed to call GLM proxy:", error);
    return "调用 GLM-4.7 时遇到问题，请稍后重试。";
  }
}
