
import React, { useState, useEffect } from 'react';
import { PuzzleType, PuzzleData } from '../types';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzleInteractionModal } from './PuzzleInteractionModal';
import { PuzzleEditorModal } from './PuzzleEditorModal';
import { generateInsightSummaries, generateActionsFromChat } from '../onHerWay/services/geminiService';
import type { ChatMessage as OhwChatMessage, ChatInsightSummary, ActionItem } from '../onHerWay/types';

// Extended type for this view
interface RecommendedPuzzle extends PuzzleData {
  recommendationReason: string;
}

interface InsightSummaryViewProps {
  onBack: () => void;
  onVisitProfile?: (author: any) => void;
  onOpenMentorChat?: () => void;
  chatMessages?: OhwChatMessage[];
  onAddAction?: (action: ActionItem) => void;
}

// Mock data for community puzzles - grouped by action difficulty
const COMMUNITY_PUZZLES: Record<string, RecommendedPuzzle[]> = {
  'Low Friction': [
    {
      id: 'lf1',
      date: '2023.12.01',
      title: '5分钟起步',
      description: '不要想整个项目，只做前5分钟的事。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 1,
      rotation: -5,
      author: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=lf1' },
      recommendationReason: '快速启动'
    },
    {
      id: 'lf2',
      date: '2023.12.03',
      title: '写下三个关键词',
      description: '把想法浓缩成三个词，思路会更清晰。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 2,
      rotation: 3,
      author: { name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=lf2' },
      recommendationReason: '简化思考'
    },
    {
      id: 'lf3',
      date: '2023.12.05',
      title: '设个手机闹钟',
      description: '让闹钟提醒你开始，不靠意志力。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 3,
      rotation: -2,
      author: { name: 'Emma', avatar: 'https://i.pravatar.cc/150?u=lf3' },
      recommendationReason: '外部提醒'
    }
  ],
  'Research': [
    {
      id: 'rs1',
      date: '2023.12.05',
      title: '模仿开始',
      description: '先照着优秀的案例做一遍，找找感觉。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 2,
      rotation: 5,
      author: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=rs1' },
      recommendationReason: '学习借鉴'
    },
    {
      id: 'rs2',
      date: '2023.12.07',
      title: '找三个参考',
      description: '收集三个同类型的优秀案例做参考。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 1,
      rotation: -3,
      author: { name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=rs2' },
      recommendationReason: '案例研究'
    },
    {
      id: 'rs3',
      date: '2023.12.09',
      title: '问问过来人',
      description: '找一个做过类似事情的人聊聊经验。',
      type: PuzzleType.GOAL,
      shapeVariant: 4,
      rotation: 8,
      author: { name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=rs3' },
      recommendationReason: '获取经验'
    }
  ],
  'Active': [
    {
      id: 'ac1',
      date: '2023.12.10',
      title: '公开承诺',
      description: '发个朋友圈说我要做这件事，逼自己一把。',
      type: PuzzleType.GOAL,
      shapeVariant: 3,
      rotation: 0,
      author: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=ac1' },
      recommendationReason: '社交压力'
    },
    {
      id: 'ac2',
      date: '2023.12.12',
      title: '先做再说',
      description: '不管质量，先完成一个粗糙版本。',
      type: PuzzleType.EXPERIENCE,
      shapeVariant: 1,
      rotation: -6,
      author: { name: 'Henry', avatar: 'https://i.pravatar.cc/150?u=ac2' },
      recommendationReason: '快速原型'
    },
    {
      id: 'ac3',
      date: '2023.12.14',
      title: '找个搭档',
      description: '拉一个朋友一起做，互相监督进度。',
      type: PuzzleType.DIFFICULTY,
      shapeVariant: 2,
      rotation: 4,
      author: { name: 'Ivy', avatar: 'https://i.pravatar.cc/150?u=ac3' },
      recommendationReason: '互助监督'
    }
  ]
};

export const InsightSummaryView: React.FC<InsightSummaryViewProps> = ({ onBack, onVisitProfile, onOpenMentorChat, chatMessages = [], onAddAction }) => {
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  // State for modals
  const [viewingPuzzle, setViewingPuzzle] = useState<RecommendedPuzzle | null>(null);
  const [editingInsight, setEditingInsight] = useState<{type: PuzzleType, content: string, label: string} | null>(null);

  // State for AI-generated insights
  const [aiInsights, setAiInsights] = useState<ChatInsightSummary | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  // State for AI-generated actions (now loaded on mount, not on insight selection)
  const [generatedActions, setGeneratedActions] = useState<ActionItem[]>([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [actionsError, setActionsError] = useState<string | null>(null);

  // Track which actions have been added
  const [addedActionIds, setAddedActionIds] = useState<Set<string>>(new Set());

  // Track which action card is expanded
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  // Helper function for difficulty colors (same as ChatView)
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'Low Friction':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'Research':
        return 'text-brand-blue border-brand-blue/30 bg-brand-blue/10';
      case 'Active':
        return 'text-brand-orange border-brand-orange/30 bg-brand-orange/10';
      default:
        return 'text-white border-white/30 bg-white/10';
    }
  };

  // Get community puzzles for expanded action
  const getExpandedActionPuzzles = (): RecommendedPuzzle[] => {
    if (!expandedActionId) return [];
    const expandedAction = generatedActions.find(a => a.id === expandedActionId);
    if (!expandedAction?.difficulty) return [];
    return COMMUNITY_PUZZLES[expandedAction.difficulty] || [];
  };

  // Fetch AI insights AND actions when component mounts or chat messages change
  useEffect(() => {
    const fetchData = async () => {
      // Convert chat messages to string array for the API
      const historyStrings = chatMessages.map(msg =>
        `${msg.role === 'user' ? 'User' : 'Mentor'}: ${msg.text}`
      );

      // Fetch insights
      setIsLoadingInsights(true);
      setInsightError(null);
      try {
        const summaries = await generateInsightSummaries(historyStrings);
        setAiInsights(summaries);
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        setInsightError('无法生成洞察，请稍后再试');
      } finally {
        setIsLoadingInsights(false);
      }

      // Fetch actions directly from chat history (no insight selection needed)
      setIsLoadingActions(true);
      setActionsError(null);
      try {
        const actions = await generateActionsFromChat(historyStrings);
        setGeneratedActions(actions);
      } catch (error) {
        console.error('Failed to generate actions:', error);
        setActionsError('无法生成推荐行动，请稍后再试');
        setGeneratedActions([]);
      } finally {
        setIsLoadingActions(false);
      }
    };

    fetchData();
  }, [chatMessages]);

  const insights = [
    {
      id: 'flag',
      type: PuzzleType.GOAL,
      label: '你可能想立的 flag',
      content: isLoadingInsights
        ? '正在分析对话...'
        : insightError
          ? insightError
          : (aiInsights?.flag || '暂未分析出此内容'),
      buttonText: '编辑并发布'
    },
    {
      id: 'question',
      type: PuzzleType.DIFFICULTY,
      label: '你可能想提问',
      content: isLoadingInsights
        ? '正在分析对话...'
        : insightError
          ? insightError
          : (aiInsights?.question || '暂未分析出此内容'),
      buttonText: '编辑并发布'
    },
    {
      id: 'experience',
      type: PuzzleType.EXPERIENCE,
      label: '你可以分享的行动经验',
      content: isLoadingInsights
        ? '正在分析对话...'
        : insightError
          ? insightError
          : (aiInsights?.experience || '暂未分析出此内容'),
      buttonText: '编辑并发布'
    }
  ];

  const handleOpenPuzzle = (puzzle: RecommendedPuzzle) => {
    setViewingPuzzle(puzzle);
  };

  const handleEditClick = (insight: typeof insights[0], e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingInsight({
          type: insight.type,
          content: insight.content,
          label: insight.label
      });
  };

  const handlePublishComplete = (_published: { title: string; description: string; type: PuzzleType }) => {
      setEditingInsight(null);
      // Navigate back to the Life Puzzle Map (Home)
      onBack();
  };

  const handleAddToActionList = (action: ActionItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddAction) {
      onAddAction(action);
      setAddedActionIds(prev => new Set(prev).add(action.id));
    }
  };

  const expandedPuzzles = getExpandedActionPuzzles();

  return (
    <>
      <div className="absolute inset-0 z-40 flex items-center justify-center p-8 md:p-16 animate-fadeIn">

        {/* Back Interaction */}
        <button
          onClick={onBack}
          className="absolute top-28 left-8 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 group"
          title="Return to Map"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {onOpenMentorChat && (
          <button
            onClick={onOpenMentorChat}
            className="absolute top-28 right-8 z-50 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10"
            title="Open Mentor Chat"
          >
            导师聊天
          </button>
        )}

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 h-full md:h-auto mt-8">

          {/* Left Column: Self Insight */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-serif-sc text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4">
              自我洞察
            </h2>

            <div className="space-y-4">
              {insights.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInsightId(item.id)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${selectedInsightId === item.id
                      ? 'bg-[#1A1A1A] border-[#F36223] shadow-[0_0_20px_rgba(243,98,35,0.2)]'
                      : 'bg-[#111]/80 border-gray-800 hover:border-gray-600 hover:bg-[#161616]'
                    }
                  `}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
                    ${item.type === PuzzleType.GOAL ? 'bg-[#FDD140]' :
                      item.type === PuzzleType.DIFFICULTY ? 'bg-[#F36223]' : 'bg-[#9FD2E3]'}`}
                  />
                  <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-mono">
                    {item.label}
                  </h3>
                  <p className={`text-lg text-white font-serif-sc mb-6 leading-relaxed ${isLoadingInsights ? 'animate-pulse text-gray-400' : ''}`}>
                    {item.content}
                  </p>

                  <button
                    className="px-4 py-2 rounded-full border border-gray-600 text-xs text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all flex items-center gap-2"
                    onClick={(e) => handleEditClick(item, e)}
                  >
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Action Recommendations */}
          <div className="md:col-span-7 flex flex-col relative pl-0 md:pl-12 border-l border-gray-800/50">
            {/* Fixed Title - aligned with 自我洞察 */}
            <h2 className="text-3xl font-serif-sc text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
              行动推荐
            </h2>

            {/* Scrollable content area with fixed structure */}
            <div className="animate-fadeIn space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">

              {/* AI-Generated Actions Section */}
              <div className="min-h-[200px]">
                <p className="text-sm text-gray-400 mb-4">你可以从以下行动快速开始</p>

                {isLoadingActions ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-brand-yellow animate-spin mb-4"></div>
                    <p className="text-gray-400 text-sm">正在生成推荐行动...</p>
                  </div>
                ) : actionsError ? (
                  <div className="glass-panel p-6 rounded-2xl border-red-500/30 text-center">
                    <p className="text-red-400">{actionsError}</p>
                    <p className="text-gray-500 text-sm mt-2">请刷新页面重试</p>
                  </div>
                ) : generatedActions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedActions.map((action, idx) => {
                      const isExpanded = expandedActionId === action.id;
                      const isAdded = addedActionIds.has(action.id);
                      return (
                        <div
                          key={action.id || idx}
                          onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                          className={`glass-panel rounded-2xl border-white/5 shadow-lg flex flex-col relative overflow-hidden cursor-pointer transition-all duration-300 ${
                            isExpanded ? 'p-5 ring-1 ring-brand-orange/50' : 'p-4 hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`absolute top-0 left-0 px-2 py-1 text-[8px] font-bold uppercase tracking-widest border-b border-r rounded-br-xl ${getDifficultyColor(
                              action.difficulty,
                            )}`}
                          >
                            {action.difficulty}
                          </div>

                          {/* Collapsed view */}
                          {!isExpanded && (
                            <div className="mt-5 flex-1 flex flex-col">
                              <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">{action.title}</h4>
                              <p className="text-gray-400 text-xs line-clamp-1 mb-3">{action.description}</p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-[10px] text-gray-500">{action.estimatedTimeMinutes}min</span>
                              </div>
                              <button
                                onClick={(e) => handleAddToActionList(action, e)}
                                disabled={isAdded}
                                className={`w-full mt-2 py-2 rounded-lg text-xs font-medium transition-all ${
                                  isAdded
                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                    : 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30'
                                }`}
                              >
                                {isAdded ? '已添加' : '添加到行动清单'}
                              </button>
                            </div>
                          )}

                          {/* Expanded view */}
                          {isExpanded && (
                            <div className="mt-5 animate-fadeIn">
                              <h4 className="text-white font-medium text-base mb-2">{action.title}</h4>
                              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{action.description}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                <span className="px-2 py-1 rounded-full bg-white/10">{action.tag}</span>
                                <span>预计 {action.estimatedTimeMinutes} 分钟</span>
                              </div>
                              <button
                                onClick={(e) => handleAddToActionList(action, e)}
                                disabled={isAdded}
                                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${
                                  isAdded
                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                    : 'bg-gradient-to-r from-brand-orange to-brand-yellow text-white hover:opacity-90'
                                }`}
                              >
                                {isAdded ? '已添加到行动清单' : '添加到行动清单'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-panel p-6 rounded-2xl border-white/5 text-center">
                    <p className="text-gray-500">暂无推荐行动</p>
                  </div>
                )}
              </div>

              {/* Community Puzzles Section - shows puzzles based on expanded action */}
              <div className="min-h-[180px]">
                <p className="text-sm text-gray-400 mb-4">看看别人是怎么做的</p>

                {expandedActionId && expandedPuzzles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {expandedPuzzles.map((puzzle, index) => (
                      <div
                        key={puzzle.id}
                        className="transform hover:scale-105 hover:z-10 transition-all duration-300 animate-float cursor-pointer"
                        style={{ animationDelay: `${index * 0.2}s` }}
                        onClick={() => handleOpenPuzzle(puzzle)}
                      >
                        <PuzzlePiece
                          data={puzzle}
                          scale={1.1}
                          showAuthor={true}
                          className="mx-auto"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel p-6 rounded-2xl border-white/5 text-center">
                    <p className="text-gray-500 text-sm">
                      {expandedActionId ? '暂无相关社区内容' : '点击上方行动卡片查看相关社区经验'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction Modal */}
      {viewingPuzzle && (
        <PuzzleInteractionModal
            viewingPuzzle={viewingPuzzle}
            onClose={() => setViewingPuzzle(null)}
            onVisitProfile={onVisitProfile}
        />
      )}

      {/* Editor Modal */}
      {editingInsight && (
          <PuzzleEditorModal
            initialType={editingInsight.type}
            initialContent={editingInsight.content}
            initialTitle="新拼图"
            onClose={() => setEditingInsight(null)}
            onPublish={handlePublishComplete}
          />
      )}
    </>
  );
};
