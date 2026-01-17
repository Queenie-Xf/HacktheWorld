import React from 'react';
import { UserProfile } from '../types';

interface NetworkViewProps {
  userProfile: UserProfile;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ userProfile }) => {
  const dailyGroups = [
    {
      id: 'g1',
      title: 'UX 转型互助会',
      matchScore: 95,
      members: 12,
      tags: ['设计', '转型'],
      description: '今日聚焦：如何准备第一份作品集？',
    },
    {
      id: 'g2',
      title: '早起打卡组',
      matchScore: 88,
      members: 5,
      tags: ['习惯', '自律'],
      description: '每天早上7点，分享一杯咖啡。',
    },
  ];

  const myConnections = [
    { id: 'c1', name: 'Anna', role: '产品经理', avatar: 'https://picsum.photos/100/100?random=20' },
    { id: 'c2', name: 'Yuqi', role: '前端开发', avatar: 'https://picsum.photos/100/100?random=21' },
    { id: 'c3', name: 'Clara', role: '插画师', avatar: 'https://picsum.photos/100/100?random=22' },
  ];

  return (
    <div className="p-4 md:p-8 pb-28 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="font-serif text-3xl font-bold text-white tracking-tight">建联交流</h2>
        <p className="text-white/40 text-sm mt-1 font-light">在星系中寻找同频信号。</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_rgba(253,209,64,0.8)]"></span>
          <h3 className="text-sm font-bold text-brand-yellow uppercase tracking-widest">AI 每日匹配小组</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyGroups.map((group) => (
            <div
              key={group.id}
              className="glass-panel p-6 rounded-3xl relative group hover:bg-white/5 transition-all cursor-pointer border border-white/10 hover:border-brand-yellow/30"
            >
              <div className="absolute top-4 right-4 text-xs font-mono text-brand-blue bg-brand-blue/10 px-2 py-1 rounded border border-brand-blue/20">
                匹配度 {group.matchScore}%
              </div>

              <h4 className="text-xl font-bold text-white mb-2">{group.title}</h4>
              <p className="text-white/60 text-sm mb-4 font-light">{group.description}</p>

              <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border border-space-900"></div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-space-800 border border-space-900 flex items-center justify-center text-[8px] text-white">
                    +{group.members}
                  </div>
                </div>
                <button className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
                  申请加入
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-4">我的通讯录</h3>
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-brand-yellow/50 group-hover:text-brand-yellow transition-all">
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">探索</span>
            </div>

            {myConnections.map((user) => (
              <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className="w-14 h-14 rounded-full relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover border border-white/10 group-hover:border-white/40 transition-all"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-space-900 rounded-full"></div>
                </div>
                <span className="text-xs text-white group-hover:text-brand-blue transition-colors">{user.name}</span>
              </div>
            ))}
          </div>

          {userProfile && (
            <div className="mt-4 text-[10px] text-white/30 font-mono uppercase tracking-widest">
              当前：{userProfile.name} · {userProfile.title}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

