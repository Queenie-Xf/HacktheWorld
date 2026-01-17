import React from 'react';
import { ActionItem } from '../types';

interface ActionCardProps {
  action: ActionItem;
  onComplete?: (id: string) => void;
  onAdd?: (action: ActionItem) => void;
  addLabel?: string;
  onAskCommunity?: (action: ActionItem) => void;
  isFeedView?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  onComplete,
  onAdd,
  addLabel = '加入行动清单',
  onAskCommunity,
  isFeedView = false,
}) => {
  const isCompleted = action.status === 'completed';

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Career':
      case 'Skill':
        return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30 shadow-[0_0_8px_rgba(159,210,227,0.2)]';
      case 'Mental':
        return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/30 shadow-[0_0_8px_rgba(253,209,64,0.2)]';
      case 'Networking':
        return 'bg-brand-orange/10 text-brand-orange border-brand-orange/30 shadow-[0_0_8px_rgba(243,98,35,0.2)]';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div
      className={`border rounded-2xl p-5 mb-3 transition-all relative overflow-hidden group ${
        isCompleted ? 'bg-space-900/50 border-white/5 opacity-60' : 'glass-panel border-white/10 hover:border-brand-yellow/20'
      }`}
    >
      {!isCompleted && !isFeedView && (
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700"></div>
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${getTagStyle(action.tag)}`}>
          {action.tag}
        </span>
        <span className="text-xs text-white/40 font-mono flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {action.estimatedTimeMinutes} MIN
        </span>
      </div>

      <h3 className={`font-bold text-base text-white mb-2 tracking-wide ${isCompleted ? 'line-through text-white/30' : ''}`}>
        {action.title}
      </h3>
      <p className="text-sm text-brand-blue/70 leading-relaxed mb-4 font-light">{action.description}</p>

      <div className="flex flex-col gap-2 mt-2 relative z-10">
        {onAdd && (
          <button
            onClick={() => onAdd(action)}
            className="w-full bg-white text-space-950 text-sm font-bold py-3 rounded-xl hover:bg-brand-blue/20 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase tracking-wider"
          >
            {addLabel}
          </button>
        )}

        {!isCompleted && !onAdd && !isFeedView && (
          <div className="flex gap-2">
            <button
              onClick={() => onComplete && onComplete(action.id)}
              className="flex-1 border border-white/20 hover:border-brand-yellow hover:text-brand-yellow text-white/80 text-sm font-medium py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10"
            >
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
                <circle cx="12" cy="12" r="10" />
              </svg>
              完成
            </button>
            {onAskCommunity && (
              <button
                onClick={() => onAskCommunity(action)}
                className="flex-1 border border-white/20 hover:border-brand-blue hover:text-brand-blue text-white/80 text-sm font-medium py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10"
              >
                <span>?</span> 求助社区
              </button>
            )}
          </div>
        )}

        {isCompleted && !isFeedView && (
          <div className="flex w-full items-center justify-center gap-2 text-brand-yellow text-sm font-bold uppercase tracking-wider bg-brand-yellow/10 py-2 rounded-xl border border-brand-yellow/20 shadow-[0_0_10px_rgba(253,209,64,0.1)]">
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
              <polyline points="20 6 9 17 4 12" />
            </svg>
            已验证
          </div>
        )}
      </div>
    </div>
  );
};
