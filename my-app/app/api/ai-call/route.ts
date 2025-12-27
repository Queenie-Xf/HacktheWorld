import { NextResponse } from "next/server";

const GLM_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const GLM_MODEL = "glm-4-plus";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body?.messages;
    const options = body?.options ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing messages for GLM request" },
        { status: 400 },
      );
    }

    const apiKey = process.env.ZHIPU_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing ZHIPU_API_KEY environment variables" },
        { status: 500 },
      );
    }

    const payload = {
      model: GLM_MODEL,
      temperature: options.temperature ?? 0.8,
      top_p: options.top_p ?? 0.8,
      stream: false,
      messages,
    };

    const response = await fetch(GLM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("GLM request failed:", response.status, detail);
      return NextResponse.json(
        { error: "GLM request failed", detail },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GLM proxy error:", error);
    return NextResponse.json(
      { error: "Unexpected error when calling GLM" },
      { status: 500 },
    );
  }
}
