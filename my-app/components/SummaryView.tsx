'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Send, ArrowLeft, CheckCircle2, Flag, HelpCircle, Lightbulb, Edit3 } from 'lucide-react';
import { CommunityAction, ExperienceType, InteractionActionType } from '../lib/types';
import { COLORS } from '../lib/constants';

interface SummaryViewProps {
  onClose: () => void;
  onViewProfile?: (authorId: string) => void;
}

const INSIGHT_ITEMS = [
  { 
    id: 'i1', 
    category: '你可能想立的flag', 
    content: '年底之前接触一个其它领域', 
    type: ExperienceType.EXPERIENCE,
    icon: <Flag className="w-5 h-5" />
  },
  { 
    id: 'i2', 
    category: '你可能想提问', 
    content: '我没有什么技能，可以怎么做？', 
    type: ExperienceType.PROBLEM,
    icon: <HelpCircle className="w-5 h-5" />
  },
  { 
    id: 'i3', 
    category: '你可以分享的行动经验', 
    content: '先在我的领域做一次实践，看看喜不喜欢', 
    type: ExperienceType.DIFFICULTY,
    icon: <Lightbulb className="w-5 h-5" />
  },
];

const ACTION_DIRECTIONS = [
  { id: 'org', label: '找到一个组织' },
  { id: 'invite', label: '发起一次邀请' },
  { id: 'friend', label: '交一个该领域的朋友' },
];

const MOCK_COMMUNITY_BY_DIRECTION: Record<string, CommunityAction[]> = {
  org: [
    { id: 'o1', action: '加入“斜杠青年”互助社', reason: '寻找跨领域交流氛围', authorAvatar: 'https://i.pravatar.cc/150?u=o1', authorId: 'u1' },
    { id: 'o2', action: '寻找本地读书会小组', reason: '沉淀深度思考内容', authorAvatar: 'https://i.pravatar.cc/150?u=o2', authorId: 'u2' },
    { id: 'o3', action: '参与开源共创项目', reason: '在实践中建立连接', authorAvatar: 'https://i.pravatar.cc/150?u=o3', authorId: 'u3' },
  ],
  invite: [
    { id: 'v1', action: '发起一次咖啡面对面', reason: '高效同步核心信息', authorAvatar: 'https://i.pravatar.cc/150?u=v1', authorId: 'u4' },
    { id: 'v2', action: '组织一次周末徒步', reason: '在放松中深入交流', authorAvatar: 'https://i.pravatar.cc/150?u=v2', authorId: 'u5' },
    { id: 'v3', action: '预约一次技术Demo演示', reason: '展示近期思考成果', authorAvatar: 'https://i.pravatar.cc/150?u=v3', authorId: 'u6' },
  ],
  friend: [
    { id: 'f1', action: '私信一位资深运营大佬', reason: '获取行业一线视角的反馈', authorAvatar: 'https://i.pravatar.cc/150?u=f1', authorId: 'u7' },
    { id: 'f2', action: '添加那位同样在转行的同行', reason: '寻找同频者的心理支持', authorAvatar: 'https://i.pravatar.cc/150?u=f2', authorId: 'u8' },
    { id: 'f3', action: '主动评论一位博主的周刊', reason: '通过内容建立高质量友谊', authorAvatar: 'https://i.pravatar.cc/150?u=f3', authorId: 'u9' },
  ]
};

const PuzzleShape = ({ className, color = "white", stroke = "#e2e8f0" }: { className?: string, color?: string, stroke?: string }) => (
  <svg viewBox="0 0 100 100" className={className} preserveAspectRatio="none">
    <path
      d="M20 0 H80 V20 C85 20 90 25 90 30 C90 35 85 40 80 40 V60 C85 60 90 65 90 70 C90 75 85 80 80 80 V100 H20 V80 C15 80 10 75 10 70 C10 65 15 60 20 60 V40 C15 40 10 35 10 30 C10 25 15 20 20 20 Z"
      fill={color}
      stroke={stroke}
      strokeWidth="1"
    />
  </svg>
);

const SummaryView: React.FC<SummaryViewProps> = ({ onClose, onViewProfile }) => {
  const [activeInsightId, setActiveInsightId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<CommunityAction | null>(null);
  const [viewState, setViewState] = useState<'main' | 'post'>('main');
  const [selectedDirection, setSelectedDirection] = useState<string>('org');
  const [postText, setPostText] = useState('');

  const handleEditAndPost = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostText(content);
    setViewState('post');
  };

  const handleFinalPost = () => {
    alert('发布成功！');
    setViewState('main');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-50 z-[200] flex flex-col p-6 md:p-12 overflow-y-auto overflow-x-hidden"
    >
      <AnimatePresence mode="wait">
        {viewState === 'main' ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col md:flex-row gap-12"
          >
            <button 
              onClick={onClose}
              className="fixed top-8 right-8 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 z-50 transition-transform active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Column: Self Insight */}
            <div className="w-full md:w-5/12 flex flex-col gap-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">自我洞察</h1>
                <p className="text-slate-400 text-sm font-medium">AI 深度复盘你的对话，提取关键路径</p>
              </div>

              <div className="space-y-4">
                {INSIGHT_ITEMS.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setActiveInsightId(item.id)}
                    className={`bg-white rounded-3xl p-6 shadow-xl transition-all cursor-pointer border-2 ${
                      activeInsightId === item.id 
                        ? 'border-blue-500 shadow-blue-500/10 scale-[1.02]' 
                        : 'border-transparent shadow-slate-200/40 opacity-80 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-slate-50" style={{ color: COLORS[item.type] }}>
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-relaxed mb-6">“{item.content}”</h3>
                    <div className="flex justify-end">
                      <button 
                        onClick={(e) => handleEditAndPost(item.content, e)}
                        className="flex items-center gap-2 text-xs font-black text-blue-500 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all active:scale-95"
                      >
                        编辑并发布 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden md:block w-px h-[80%] my-auto bg-slate-200/60 mx-4" />

            {/* Right Column: Minimum Action Recommendations (Conditional) */}
            <div className="w-full md:flex-1">
              <AnimatePresence mode="wait">
                {activeInsightId ? (
                  <motion.div 
                    key="recommendations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">推荐给你的最小行动</h2>
                        <span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">Powered by Community</span>
                      </div>
                      
                      {/* Direction Tabs */}
                      <div className="flex flex-wrap gap-2.5">
                        {ACTION_DIRECTIONS.map((dir) => (
                          <button
                            key={dir.id}
                            onClick={() => setSelectedDirection(dir.id)}
                            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                              selectedDirection === dir.id 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            {dir.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations Row */}
                    <div className="relative pt-4">
                      <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar px-2">
                        {(MOCK_COMMUNITY_BY_DIRECTION[selectedDirection] || []).map((action) => (
                          <motion.div
                            key={action.id}
                            whileHover={{ y: -10, rotate: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedAction(action)}
                            className="flex-shrink-0 w-64 h-80 relative cursor-pointer snap-center group"
                          >
                            <div className="absolute inset-0 drop-shadow-2xl group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.1)] transition-all">
                               <PuzzleShape className="w-full h-full" color="white" stroke="#f1f5f9" />
                            </div>
                            <div className="relative h-full flex flex-col justify-between p-12 z-10">
                              <h4 className="text-xl font-extrabold text-slate-800 leading-tight">“{action.action}”</h4>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img src={action.authorAvatar} className="w-10 h-10 rounded-full border-2 border-slate-50 shadow-sm" alt="" />
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                   <p className="text-[10px] text-slate-400 font-black uppercase">作者见地</p>
                                   <p className="text-[10px] text-slate-800 font-bold">查看拼图</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        基于你选中的 <span className="font-black text-slate-900">“{INSIGHT_ITEMS.find(i => i.id === activeInsightId)?.content}”</span>，我们为你匹配了社区中跨领域的行动经验。
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-slate-300 gap-4"
                  >
                    <div className="w-20 h-20 rounded-[2rem] border-4 border-dashed border-slate-200 flex items-center justify-center">
                      <Edit3 className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-bold text-lg">点击左侧洞察以开启行动方案</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="post"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-white z-[500] flex flex-col items-center p-8 overflow-y-auto"
          >
            <div className="w-full max-w-2xl mt-12">
              <div className="flex items-center justify-between mb-16">
                <button onClick={() => setViewState('main')} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <ArrowLeft className="w-7 h-7 text-slate-400" />
                </button>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">编辑洞察</h2>
                <div className="w-10" />
              </div>

              <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-inner mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">你的见地</span>
                </div>
                <textarea 
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-3xl font-black text-slate-800 leading-snug placeholder:text-slate-200 min-h-[250px] resize-none"
                  placeholder="让思考流淌..."
                />
              </div>

              <button 
                onClick={handleFinalPost}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-[0.98] group"
              >
                确认发布到社区 <CheckCircle2 className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              </button>
              
              <p className="mt-8 text-center text-slate-400 text-sm font-medium">
                发布后，你的这条洞察将同步到你的主页拼图，并对社区可见。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Detail Modal (from selection) */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[600] flex items-center justify-center p-4"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl aspect-square flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute inset-0 drop-shadow-2xl">
                <PuzzleShape className="w-full h-full" color="white" stroke="transparent" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center text-center px-16 h-full w-full">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-12 leading-tight">“{selectedAction.action}”</h2>
                
                <div className="flex flex-col items-center gap-10">
                  <div 
                    className="group/avatar cursor-pointer flex flex-col items-center gap-4"
                    onClick={() => {
                        setSelectedAction(null);
                        onViewProfile?.(selectedAction.authorId);
                    }}
                  >
                    <div className="relative">
                      <img src={selectedAction.authorAvatar} className="w-28 h-28 rounded-full border-[6px] border-slate-50 shadow-2xl group-hover/avatar:scale-110 transition-transform" alt="" />
                      <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover/avatar:bg-blue-500/10 transition-colors flex items-center justify-center">
                        <ArrowRight className="text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity w-10 h-10" />
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover/avatar:text-blue-600 transition-colors">点击进入作者主页</span>
                  </div>

                  <div className="bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 shadow-inner">
                    <p className="text-slate-600 text-sm font-bold italic">“{selectedAction.reason}”</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SummaryView;
