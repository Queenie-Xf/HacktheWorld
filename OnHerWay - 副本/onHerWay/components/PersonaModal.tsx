import React from 'react';
import { UserProfile } from '../types';

interface PersonaModalProps {
  profile: Partial<UserProfile>;
  onContinue: () => void;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({ profile, onContinue }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-space-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-lg relative">
        <div className="glass-panel-heavy rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(253,209,64,0.1)] border border-white/10 relative">
          <div className="h-2 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-blue"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-[0.2em] animate-pulse">
                  身份已生成
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">你的探索者卡片</h2>
              <p className="text-sm text-gray-400 mt-2 font-light">基于我们的初次对话。</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex-shrink-0 relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/20 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <img
                    src={profile.avatar || 'https://picsum.photos/200'}
                    alt="AI Avatar"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-space-900 px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white whitespace-nowrap">
                  {profile.name}
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] uppercase tracking-wider text-brand-blue font-bold mb-1">身份</div>
                  <div className="text-white text-sm font-medium">{profile.role_detail || '未定义'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] uppercase tracking-wider text-brand-yellow font-bold mb-1">状态</div>
                    <div className="text-white text-xs">{profile.experience || '分析中...'}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] uppercase tracking-wider text-brand-orange font-bold mb-1">目标</div>
                    <div className="text-white text-xs">{profile.goal || '分析中...'}</div>
                  </div>
                </div>

                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/10">
                  <div className="text-[9px] uppercase tracking-wider text-red-400 font-bold mb-1">当前阻碍</div>
                  <div className="text-white text-xs opacity-80">{profile.hassle || '未知'}</div>
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full mt-8 bg-white text-space-950 font-bold py-4 rounded-xl hover:bg-brand-blue/20 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
            >
              <span>确认身份</span>
              <svg
                className="group-hover:translate-x-1 transition-transform"
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

