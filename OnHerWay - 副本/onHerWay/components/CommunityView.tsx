import React, { useState } from 'react';
import { Post } from '../types';
import { ActionCard } from './ActionCard';

interface CommunityViewProps {
  posts: Post[];
}

export const CommunityView: React.FC<CommunityViewProps> = ({ posts }) => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'hot' | 'friends'>('recommend');

  const displayPosts = posts;

  return (
    <div className="p-4 md:p-8 pb-28 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white tracking-tight">社区动态</h2>
          <p className="text-white/40 text-sm mt-1 font-light">来自其他探索者的信号。</p>
        </div>

        <div className="glass-panel p-1 rounded-full flex items-center bg-black/20">
          {(['recommend', 'hot', 'friends'] as const).map((tab) => {
            const labels = { recommend: '推荐', hot: '热门', friends: '好友' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                   px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                   ${isActive ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white/70'}
                 `}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-3xl p-6 relative group hover:bg-white/5 transition-colors border-white/5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-brand-blue to-brand-orange">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-full h-full rounded-full object-cover border-2 border-space-950"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-space-950 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-wide">{post.userName}</h4>
                <p className="text-xs text-white/50">{post.userTitle}</p>
              </div>
              <span className="ml-auto text-[10px] text-white/30 font-mono tracking-widest uppercase">{post.timeAgo}</span>
            </div>

            <div className="mb-5 pl-16">
              {post.type === 'question' && (
                <span className="inline-block bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded mb-2 border border-brand-blue/20 tracking-wider">
                  ❓ 请求导航数据
                </span>
              )}
              {post.type === 'success' && (
                <span className="inline-block bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-2 py-0.5 rounded mb-2 border border-brand-yellow/20 tracking-wider">
                  🎉 发现日志
                </span>
              )}
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-light">{post.content}</p>
            </div>

            {post.actionTaken && (
              <div className="mb-4 pl-16 transform scale-[0.98] origin-left w-full">
                <ActionCard action={post.actionTaken} isFeedView={true} />
              </div>
            )}

            <div className="flex items-center gap-6 text-white/40 text-sm border-t border-white/5 pt-4 pl-16">
              <button className="flex items-center gap-2 hover:text-brand-orange transition-colors group">
                <svg
                  className="group-hover:scale-110 transition-transform"
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="font-mono text-xs">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="font-mono text-xs">{post.comments}</span>
              </button>
              {post.type === 'question' && (
                <button className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-blue hover:text-white transition-colors">
                  回复信号
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

