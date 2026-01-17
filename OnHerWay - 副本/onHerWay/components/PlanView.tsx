import React from 'react';
import { ActionItem } from '../types';
import { ActionCard } from './ActionCard';

interface PlanViewProps {
  actions: ActionItem[];
  onCompleteAction: (id: string) => void;
  onShareAction: (action: ActionItem) => void;
  onAskAction: (action: ActionItem) => void;
  onNavigateToChat: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  actions,
  onCompleteAction,
  onShareAction,
  onAskAction,
  onNavigateToChat,
}) => {
  return (
    <div className="p-4 md:p-8 pb-24 max-w-3xl mx-auto">
      <div className="glass-panel p-8 rounded-3xl mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/20 blur-[60px] rounded-full group-hover:bg-brand-orange/20 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <h2 className="font-serif text-3xl font-bold text-white mb-2 tracking-tight">行动清单</h2>
          <p className="text-brand-blue/70 text-sm font-light">跬步千里，始于足下。</p>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-white/10 flex flex-col items-center">
          <div className="text-6xl mb-6 opacity-80 animate-float">🌑</div>
          <h3 className="text-lg font-medium text-white tracking-wide">暂无行动计划</h3>
          <p className="text-white/40 text-sm px-8 mt-2 max-w-xs mx-auto font-light">
            你的轨迹等待启动指令。<br />
            联系 AI 导师计算你的第一步。
          </p>
          <button
            onClick={onNavigateToChat}
            className="mt-8 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold uppercase tracking-widest transition-all hover:scale-105"
          >
            开始链接 &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-2">
            <span>任务日志</span>
            <span>
              {actions.filter((a) => a.status === 'completed').length}/{actions.length} 已完成
            </span>
          </div>

          {actions.map((action) => (
            <div key={action.id} className="relative group">
              <ActionCard action={action} onComplete={onCompleteAction} onAskCommunity={onAskAction} />
              {action.status === 'completed' && !action.isShared && (
                <div className="absolute -right-2 -top-2 animate-bounce z-20">
                  <button
                    onClick={() => onShareAction(action)}
                    className="bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(243,98,35,0.6)] hover:scale-105 transition-transform flex items-center gap-1"
                  >
                    <span>✨</span> 发布
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

