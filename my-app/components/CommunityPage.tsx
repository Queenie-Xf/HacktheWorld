'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageSquare, AlertCircle, Lightbulb } from 'lucide-react';
import { ExperienceType } from '../lib/types';
import { COLORS } from '../lib/constants';

const MOCK_COMMUNITY_PUZZLES = [
  { id: 'c1', type: ExperienceType.PROBLEM, content: '如何平衡创业初期的理想与现实的现金流压力？', author: '创业者小王', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'c2', type: ExperienceType.DIFFICULTY, content: '在高度竞争的行业里，如何保持个人的差异化竞争优势？', author: '设计师豆豆', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'c3', type: ExperienceType.EXPERIENCE, content: '通过三个月的深度冥想，我彻底重塑了我的工作流节奏。', author: '自愈者林', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'c4', type: ExperienceType.PROBLEM, content: '当团队成员不再信任你的决策时，该如何重建权威？', author: 'PM老李', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'c5', type: ExperienceType.DIFFICULTY, content: '技术架构选型失败后的复盘与推倒重来。', author: '架构师阿强', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'c6', type: ExperienceType.EXPERIENCE, content: '从零开始建立个人知识库的10个核心法则。', author: '内容创作者', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 'c7', type: ExperienceType.PROBLEM, content: '在AI时代，我们该如何定义人类独有的创造力？', author: '哲学家小周', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 'c8', type: ExperienceType.DIFFICULTY, content: '跨国团队协作中的文化隔阂与沟通黑洞。', author: '全球协作员', avatar: 'https://i.pravatar.cc/150?u=8' },
  { id: 'c9', type: ExperienceType.EXPERIENCE, content: '极简主义生活方式带给我的自由与专注。', author: '极简者', avatar: 'https://i.pravatar.cc/150?u=9' },
];

const PuzzleShape = ({ className, color = "white" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
    <path
      d="M20 0 H80 V20 C85 20 90 25 90 30 C90 35 85 40 80 40 V60 C85 60 90 65 90 70 C90 75 85 80 80 80 V100 H20 V80 C15 80 10 75 10 70 C10 65 15 60 20 60 V40 C15 40 10 35 10 30 C10 25 15 20 20 20 Z"
      fill={color}
    />
  </svg>
);

const CommunityPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ExperienceType>(ExperienceType.PROBLEM);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPuzzles = MOCK_COMMUNITY_PUZZLES.filter(p => p.type === activeFilter && 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 pb-40 min-h-screen animate-in fade-in duration-500">
      {/* Search Bar - Top Centered */}
      <div className="flex flex-col items-center gap-10 mb-14">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="搜寻他人的思考路径..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-[2.5rem] py-5.5 pl-14 pr-8 text-slate-800 placeholder:text-slate-400 focus:ring-4 ring-blue-500/5 focus:border-blue-200 transition-all text-lg font-medium"
          />
        </div>

        {/* Filter Category Tabs */}
        <div className="flex gap-4 p-1.5 bg-slate-200/50 rounded-3xl backdrop-blur-sm shadow-inner">
          {[
            { type: ExperienceType.PROBLEM, label: '问题', icon: <MessageSquare className="w-4 h-4" />, color: COLORS.problem },
            { type: ExperienceType.DIFFICULTY, label: '困难', icon: <AlertCircle className="w-4 h-4" />, color: COLORS.difficulty },
            { type: ExperienceType.EXPERIENCE, label: '经验', icon: <Lightbulb className="w-4 h-4" />, color: COLORS.experience },
          ].map((filter) => (
            <button
              key={filter.type}
              onClick={() => setActiveFilter(filter.type)}
              className={`px-10 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeFilter === filter.type 
                  ? 'bg-white text-slate-900 shadow-lg scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: filter.color }} />
              <span className="text-sm tracking-wide">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Masonry / Waterfall Grid of Puzzles */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 px-4">
        <AnimatePresence mode="popLayout">
          {filteredPuzzles.map((puzzle) => (
            <motion.div
              key={puzzle.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative aspect-square w-full">
                {/* Puzzle Shape Background with Dynamic Colors */}
                <div className="absolute inset-0 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <PuzzleShape 
                    className="w-full h-full transition-colors duration-500" 
                    color="white" 
                  />
                  {/* Subtle color glow based on type */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" style={{ backgroundColor: COLORS[puzzle.type] }} />
                </div>
                
                {/* Content Overlay */}
                <div className="relative h-full flex flex-col p-14 text-center items-center justify-center z-10">
                  <div className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border" style={{ borderColor: `${COLORS[puzzle.type]}33`, color: COLORS[puzzle.type] }}>
                      {puzzle.type}
                    </span>
                  </div>
                  <p className="text-slate-700 font-bold text-lg md:text-xl leading-relaxed line-clamp-4 transition-colors group-hover:text-slate-900">
                    {puzzle.content}
                  </p>
                  <div className="mt-10 flex items-center gap-3">
                    <img src={puzzle.avatar} className="w-7 h-7 rounded-full border border-slate-100 shadow-sm" alt="" />
                    <span className="text-[11px] font-bold text-slate-400 tracking-tight">{puzzle.author}</span>
                  </div>
                </div>

                {/* Interaction Hover Visual (Connecting Logo) */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                      <Search className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredPuzzles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <Filter className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-xl font-bold tracking-tight text-slate-300">还没有找到相关的路径...</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
          >
            清除搜索重试
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
