import React from 'react';
import { ActionItem, UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  completedActions: ActionItem[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, completedActions }) => {
  const sortedActions = [...completedActions].sort((a, b) => b.createdAt - a.createdAt);

  const identityAttributes = [
    { label: '身份', value: profile.title },
    { label: '坐标', value: profile.location || '未知' },
    { label: '能量', value: profile.tags.length > 0 ? profile.tags.slice(0, 3).join(', ') : '分析中...' },
    { label: '状态', value: profile.currentState || '扫描中...' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-6 space-y-6">
            <div className="text-center relative glass-panel p-6 rounded-3xl border border-white/10">
              <div className="relative inline-block group mb-4">
                <div className="absolute inset-[-8px] rounded-full border border-brand-orange/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-[-4px] rounded-full border border-brand-blue/30 animate-[spin_15s_linear_infinite_reverse]"></div>

                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full relative z-10 overflow-hidden border-2 border-white/20">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-brand-yellow/30 blur-3xl -z-10 rounded-full"></div>
              </div>

              <h1 className="text-2xl font-serif font-bold text-white tracking-tight">{profile.name}</h1>
              <p className="text-brand-blue/70 font-mono text-[10px] uppercase tracking-widest mt-1">{profile.title}</p>

              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse shadow-[0_0_10px_rgba(253,209,64,0.8)]"></span>
                <span className="text-[9px] font-bold text-white uppercase tracking-[0.15em]">
                  LVL {Math.floor(sortedActions.length / 3) + 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {identityAttributes.map((attr, i) => (
                <div
                  key={i}
                  className="flex flex-col p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">{attr.label}</div>
                  <div className="text-xs font-medium text-white truncate">{attr.value}</div>
                </div>
              ))}
            </div>

            {profile.tags.length > 3 && (
              <div className="p-4 rounded-2xl glass-panel border-white/5">
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-3">技能模块</div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.slice(3).map((tag) => (
                    <span key={tag} className="text-[9px] bg-white/5 text-brand-blue px-2 py-1 rounded border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold font-serif text-white tracking-wide">时空轨迹</h2>
              <p className="text-xs text-white/40 font-light mt-1">你的每一个脚印，都在星系中回响。</p>
            </div>
            <span className="text-xs font-mono text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
              {sortedActions.length} 里程碑
            </span>
          </div>

          {sortedActions.length === 0 && (
            <div className="p-12 rounded-3xl border border-dashed border-white/10 text-white/30 glass-panel text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-4xl opacity-50 mb-4 grayscale">🚀</div>
              <p className="font-light text-sm">你的轨迹等待启动。</p>
              <p className="text-xs text-white/20 mt-1">完成行动清单中的任务来填充日志。</p>
            </div>
          )}

          <div className="relative pl-8 md:pl-10 space-y-8">
            {sortedActions.length > 0 && (
              <div className="absolute top-4 bottom-0 left-[19px] md:left-[23px] w-0.5 bg-gradient-to-b from-brand-yellow/50 via-white/10 to-transparent"></div>
            )}

            {sortedActions.map((action, index) => {
              const date = new Date(action.createdAt);
              const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

              const tagStyle =
                action.tag === 'Career'
                  ? 'text-brand-blue bg-brand-blue/10 border-brand-blue/20'
                  : action.tag === 'Mental'
                    ? 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20'
                    : action.tag === 'Networking'
                      ? 'text-brand-orange bg-brand-orange/10 border-brand-orange/20'
                      : 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';

              return (
                <div key={action.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute -left-[38px] md:-left-[44px] top-6 w-10 h-10 flex items-center justify-center z-10">
                    <div className="w-3 h-3 rounded-full bg-space-950 border-2 border-brand-yellow shadow-[0_0_10px_rgba(253,209,64,0.5)] group-hover:scale-125 transition-transform"></div>
                  </div>

                  <div
                    className={`
                      flex flex-col md:flex-row gap-4 p-5 rounded-2xl border border-white/5 glass-panel
                      hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(253,209,64,0.05)]
                   `}
                  >
                    <div className="md:w-32 flex-shrink-0 flex md:flex-col justify-between md:justify-start gap-2">
                      <span className="text-xs font-mono text-white/60 font-bold">{dateString}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit ${tagStyle}`}>
                        {action.tag}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors leading-tight">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light mb-3">{action.description}</p>

                      <div className="flex items-center gap-3">
                        {action.isShared && (
                          <span className="text-[10px] flex items-center gap-1 text-brand-orange bg-brand-orange/5 px-2 py-1 rounded-full border border-brand-orange/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" y1="2" x2="12" y2="15" />
                            </svg>
                            已广播至星系
                          </span>
                        )}
                        <span className="text-[10px] text-white/20 font-mono ml-auto">+{action.estimatedTimeMinutes} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

