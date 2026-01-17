import React, { useState } from 'react';
import { ActionItem, AnalysisResult, Insight } from '../types';
import { generateActionsForInsight } from '../services/geminiService';
import { ActionCard } from './ActionCard';

interface InsightFlowProps {
  analysis: AnalysisResult;
  onAddAction: (action: ActionItem) => void;
  onClose: () => void;
}

export const InsightFlow: React.FC<InsightFlowProps> = ({ analysis, onAddAction, onClose }) => {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [generatedActions, setGeneratedActions] = useState<ActionItem[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);

  const handleSelectInsight = async (insight: Insight) => {
    setSelectedInsight(insight);
    setLoadingActions(true);
    const actions = await generateActionsForInsight(insight);
    setGeneratedActions(actions.map((a) => ({ ...a, sourceInsightType: insight.type })));
    setLoadingActions(false);
  };

  const handleAdd = (action: ActionItem) => {
    onAddAction(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-space-950/80 backdrop-blur-md flex items-end md:items-center justify-center p-4">
      <div className="glass-panel-heavy w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
        <div className="p-6 border-b border-white/10 relative bg-white/5">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-blue"></div>

          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
            <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest">分析完成</span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-white">模式识别</h2>
          <p className="text-sm text-brand-blue/70 mt-2 font-light leading-relaxed border-l-2 border-white/20 pl-3">
            "{analysis.summary}"
          </p>

          {analysis.newTags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {analysis.newTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider bg-brand-blue/20 text-brand-blue border border-brand-blue/30 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(159,210,227,0.2)]"
                >
                  + {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {!selectedInsight ? (
            <>
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">检测到的方向</h3>
              <div className="space-y-3">
                {analysis.insights.map((insight) => (
                  <button
                    key={insight.id}
                    onClick={() => handleSelectInsight(insight)}
                    className="w-full text-left glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          insight.type === 'Problem'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : insight.type === 'Goal'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {insight.type}
                      </span>
                      <span className="text-white/30 group-hover:text-white transition-colors">→</span>
                    </div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-brand-yellow transition-colors">{insight.title}</h4>
                    <p className="text-sm text-gray-400 font-light">{insight.description}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 animate-fade-in">
                <button
                  onClick={() => {
                    setSelectedInsight(null);
                    setGeneratedActions([]);
                  }}
                  className="text-xs text-brand-blue hover:text-white font-mono mb-4 flex items-center gap-1 uppercase tracking-wider"
                >
                  ← 返回列表
                </button>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-serif text-xl font-bold text-white mb-1">{selectedInsight.title}</h3>
                  <p className="text-sm text-gray-400 font-light">{selectedInsight.description}</p>
                </div>
              </div>

              {loadingActions && (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
                  ))}
                  <div className="text-center text-xs text-brand-yellow font-mono animate-pulse">正在生成行动方案...</div>
                </div>
              )}

              {!loadingActions && (
                <div className="space-y-4 animate-fade-in-up">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">推荐的第一步</h4>
                  {generatedActions.map((action) => (
                    <ActionCard key={action.id} action={action} onAdd={() => handleAdd(action)} addLabel="发布为拼图" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
