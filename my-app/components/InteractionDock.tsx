"use client";

import React, { useState, useCallback } from "react";
import { Send, Phone, PhoneOff } from "lucide-react";
// 确保导入路径正确
import { callGLM, type ChatMessage } from "@/lib/aiService";

interface InteractionDockProps {
  onCallEnded: () => void;
  activeTab: "home" | "community";
}

const CALL_SYSTEM_PROMPT =
  "你是一个贴心的心理咨询师与反思伴侣。使用温柔、自然的语气，鼓励用户表达今日的反思内容，必要时给出安抚与引导。输出中文。";

const InteractionDock: React.FC<InteractionDockProps> = ({
  onCallEnded,
  activeTab,
}) => {
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callInputText, setCallInputText] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [userTranscription, setUserTranscription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const updateConversationText = useCallback((messages: ChatMessage[]) => {
    const text = messages
      .filter((msg) => msg.role !== "system")
      .map((msg) =>
        msg.role === "assistant"
          ? `向导：${msg.content}`
          : `我：${msg.content}`,
      )
      .join("\n");
    setUserTranscription(text);
  }, []);

  const startCall = async () => {
    if (isCalling) return;
    setIsCalling(true);
    
    const baseMessages: ChatMessage[] = [
      { role: "system", content: CALL_SYSTEM_PROMPT },
    ];
    
    setConversation(baseMessages);
    setUserTranscription("GLM-4-plus 正在连接…");
    setIsGenerating(true);

    try {
      const greeting = await callGLM(
        [
          ...baseMessages,
          {
            role: "user",
            content: "我们刚刚接通语音，请用两句话问候我，并温柔地邀请我分享今天的状况。",
          },
        ],
        { model: "glm-4-plus" } 
      );

      const nextMessages: ChatMessage[] = [
        ...baseMessages,
        { role: "assistant", content: greeting },
      ];
      
      setConversation(nextMessages);
      updateConversationText(nextMessages);
    } catch (error) {
      console.error("Failed to fetch greeting from GLM", error);
      setUserTranscription("暂时无法连接 GLM-4-plus，请稍后再试。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCallTextSend = async () => {
    const trimmed = callInputText.trim();
    if (!trimmed || isGenerating) return;

    // 修复点：合并逻辑并显式指定类型
    const userMessage: ChatMessage = { 
      role: "user" as const, 
      content: trimmed 
    };

    const history: ChatMessage[] = conversation.length
      ? conversation
      : [{ role: "system", content: CALL_SYSTEM_PROMPT }];
    
    const withUser: ChatMessage[] = [...history, userMessage];
    
    setConversation(withUser);
    setCallInputText("");
    updateConversationText(withUser);

    setIsGenerating(true);
    try {
      // 传递正确合并后的数组
      const reply = await callGLM(withUser, { model: "glm-4-plus" });
      
      const updated: ChatMessage[] = [
        ...withUser, 
        { role: "assistant", content: reply }
      ];
      
      setConversation(updated);
      updateConversationText(updated);
    } catch (error) {
      console.error("Failed to send GLM message", error);
      const fallback: ChatMessage[] = [
        ...withUser,
        {
          role: "assistant",
          content: "这次我没有听清楚，可以再说一遍吗？",
        },
      ];
      setConversation(fallback);
      updateConversationText(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopCall = (showSummary = false) => {
    setIsCalling(false);
    setConversation([]);
    setCallInputText("");
    setUserTranscription("");
    setIsGenerating(false);
    if (showSummary) {
      onCallEnded(); 
    }
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    setPostText("");
    setIsPosting(false);
  };

  return (
    <>
      {isCalling && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-between py-12 px-8 text-slate-900 transition-all duration-500">
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              今天有什么想聊的吗？
            </h2>
            <div className="min-h-[120px] w-full mb-8">
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic whitespace-pre-line">
                {userTranscription || "正在连接 GLM-4-plus..."}
              </p>
            </div>
            
            <div className="mb-12 flex items-center justify-center gap-1 h-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    height: `${15 + Math.random() * 25}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            <div className="w-full max-w-md bg-slate-100 rounded-2xl p-2 flex items-center shadow-inner border border-slate-200">
              <input
                type="text"
                placeholder="在此输入想法..."
                value={callInputText}
                onChange={(e) => setCallInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCallTextSend()}
                disabled={isGenerating}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 text-sm font-medium"
              />
              <button
                onClick={handleCallTextSend}
                disabled={!callInputText.trim() || isGenerating}
                className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => stopCall(true)}
              className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-500/30"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "home" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2.5 flex items-center gap-2.5">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="记录今日反思..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onFocus={() => setIsPosting(true)}
                className="w-full bg-slate-100/60 border-none rounded-2xl py-3.5 px-5 text-sm font-medium"
              />
              {isPosting && (
                <button
                  onClick={handlePost}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-px h-8 bg-slate-200 mx-1" />
            <button
              onClick={startCall}
              className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractionDock;