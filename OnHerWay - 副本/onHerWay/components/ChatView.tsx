import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  isTyping: boolean;
  onSendMessage: () => void;
  onStartVoice: () => void;
  onNavigateToInsight?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  inputText,
  setInputText,
  isTyping,
  onSendMessage,
  onStartVoice,
  onNavigateToInsight,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full pb-24 relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 md:p-6 relative backdrop-blur-md transition-all duration-500 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-brand-orange/90 to-brand-orange/70 text-white rounded-tr-none border border-white/20 shadow-[0_0_20px_rgba(243,98,35,0.2)]'
                  : 'glass-panel text-gray-100 rounded-tl-none border-white/10'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed tracking-wide font-light">{msg.text}</p>
            </div>

            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-6 w-full max-w-2xl animate-fade-in-up">
                <div className="glass-panel p-6 rounded-2xl border-white/10 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></div>
                    <span className="text-sm text-white/80">已帮你生成洞察和行动推荐</span>
                  </div>
                  <button
                    onClick={onNavigateToInsight}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>查看自我洞察</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <span className="text-[10px] text-white/30 mt-2 mx-2 font-mono uppercase tracking-widest">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start animate-pulse">
            <div className="glass-panel px-6 py-4 rounded-2xl rounded-tl-none flex space-x-2 items-center">
              <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div
                className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent">
        <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-2 flex items-end gap-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <button
            onClick={onStartVoice}
            className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-brand-yellow group"
            title="Open Comms"
          >
            <div className="absolute inset-0 bg-brand-yellow/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg
              className="relative z-10 group-hover:scale-110 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="输入你的想法..."
            className="flex-1 bg-transparent border-none text-white px-4 py-3 text-sm focus:ring-0 placeholder-white/30 resize-none no-scrollbar font-light tracking-wide"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <button
            onClick={onSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-space-950 hover:bg-brand-blue/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

