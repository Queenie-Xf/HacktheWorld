
import React, { useState, useMemo } from 'react';
import { CommunityTab, PuzzleType, PuzzleData } from '../types';
import { INITIAL_PUZZLES, COLORS } from '../constants';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzleInteractionModal } from './PuzzleInteractionModal';

interface CommunityViewProps {
  onBack: () => void;
  onVisitProfile?: (author: any) => void;
}

// Defined positions for the 5 floating puzzles to ensure they are spread out
const FLOATING_POSITIONS = [
  { top: '25%', left: '20%', animationDelay: '0s' },
  { top: '28%', right: '18%', animationDelay: '1.5s' },
  { top: '55%', left: 'calc(50% - 120px)', animationDelay: '0.5s' }, // Center-ish
  { top: '70%', left: '20%', animationDelay: '2s' },
  { top: '65%', right: '22%', animationDelay: '3.5s' },
];

export const CommunityView: React.FC<CommunityViewProps> = ({ onBack, onVisitProfile }) => {
  const [activeTab, setActiveTab] = useState<CommunityTab>(CommunityTab.EXPERIENCE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State for interaction modal
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleData | null>(null);

  // Filter and then pick 5 random puzzles
  const displayPuzzles = useMemo(() => {
    let type = PuzzleType.EXPERIENCE;
    if (activeTab === CommunityTab.DIFFICULTY) type = PuzzleType.DIFFICULTY;
    if (activeTab === CommunityTab.GOAL) type = PuzzleType.GOAL;

    const filtered = INITIAL_PUZZLES.filter(p => {
        const matchesType = p.type === type;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Shuffle and slice first 5
    return [...filtered].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [activeTab, searchQuery, isRefreshing]); // Re-shuffle on refresh

  const handleRefresh = () => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 800);
  };

  const handlePuzzleClick = (puzzle: PuzzleData) => {
      setSelectedPuzzle(puzzle);
  };

  // Dynamic Styles for Orbs
  const getOrbStyle = (tab: CommunityTab, color: string) => {
      const isActive = activeTab === tab;
      return `w-16 h-16 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]
              ${isActive ? 'scale-110 opacity-100 ring-4 ring-white/20' : 'scale-90 opacity-60 hover:opacity-100'}
              backdrop-blur-sm relative group select-none`;
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <div className="absolute inset-0 z-30 pt-32 px-12 pb-12 flex flex-col items-center overflow-hidden">
        
        {/* Back Interaction (Top Left) */}
        <button 
          onClick={onBack}
          className="absolute top-28 left-8 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 group"
          title="Return to Map"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        <h2 className="text-4xl font-serif-sc text-pink-200 mb-6 tracking-wider drop-shadow-lg z-50">
            HER WAY 社区
        </h2>

        {/* Search Bar & Refresh - Placed directly under title */}
        <div className="flex gap-3 mb-4 w-full max-w-lg relative z-50">
          <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-300 transition-colors">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
              </div>
              <input 
                  type="text" 
                  className="block w-full pl-11 pr-3 py-3 border border-gray-600 rounded-full leading-5 bg-[#1A1A1A]/90 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-sm transition-all shadow-lg backdrop-blur-md font-sans" 
                  placeholder="可以提问 / 关键词搜索" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          <button 
              onClick={handleRefresh}
              className={`w-12 h-12 flex-shrink-0 bg-[#222]/80 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-all flex items-center justify-center hover:scale-105 hover:border-pink-300/50 ${isRefreshing ? 'animate-spin' : ''}`}
              title="刷新拼图"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
          </button>
        </div>
        
        {/* Orb Navigation (Left side absolute) */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col space-y-8 z-50">
          <div 
              onClick={() => setActiveTab(CommunityTab.EXPERIENCE)}
              className={getOrbStyle(CommunityTab.EXPERIENCE, COLORS[PuzzleType.EXPERIENCE])}
              style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${COLORS[PuzzleType.EXPERIENCE]}, #4A7A8C)`
              }}
          >
              <span className="text-black drop-shadow-sm font-sans">经验</span>
          </div>
          <div 
              onClick={() => setActiveTab(CommunityTab.DIFFICULTY)}
              className={getOrbStyle(CommunityTab.DIFFICULTY, COLORS[PuzzleType.DIFFICULTY])}
              style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${COLORS[PuzzleType.DIFFICULTY]}, #8C3A1F)`
              }}
          >
              <span className="text-white drop-shadow-md font-sans">困难</span>
          </div>
          <div 
              onClick={() => setActiveTab(CommunityTab.GOAL)}
              className={getOrbStyle(CommunityTab.GOAL, COLORS[PuzzleType.GOAL])}
              style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${COLORS[PuzzleType.GOAL]}, #8C7A2F)`
              }}
          >
              <span className="text-black drop-shadow-sm font-sans">目标</span>
          </div>
        </div>

        {/* Floating Puzzles Layer */}
        <div className={`absolute inset-0 z-40 pointer-events-none transition-opacity duration-500 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}>
          {displayPuzzles.map((p, index) => (
              <div 
                key={p.id} 
                className="absolute animate-float hover:z-50 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  ...FLOATING_POSITIONS[index % FLOATING_POSITIONS.length],
                  pointerEvents: 'auto'
                }}
                onClick={() => handlePuzzleClick(p)}
              >
                  <PuzzlePiece 
                      data={p} 
                      scale={1.4} 
                      showAuthor={true}
                  />
              </div>
          ))}
          
          {displayPuzzles.length === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-500 font-serif-sc">
                  没有找到相关拼图...
              </div>
          )}
        </div>
      </div>

      {/* Interaction Modal */}
      {selectedPuzzle && (
          <PuzzleInteractionModal 
             viewingPuzzle={{...selectedPuzzle, recommendationReason: ''}} 
             onClose={() => setSelectedPuzzle(null)}
             onVisitProfile={onVisitProfile}
          />
      )}
    </>
  );
};
