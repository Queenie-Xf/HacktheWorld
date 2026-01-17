
import React, { useState } from 'react';
import { PuzzleData, PuzzleType } from '../types';
import { PuzzlePiece } from './PuzzlePiece';
import { INITIAL_PUZZLES } from '../constants';

interface PuzzleInteractionModalProps {
  viewingPuzzle: PuzzleData & { recommendationReason?: string };
  onClose: () => void;
  onVisitProfile?: (author: any) => void;
}

export const PuzzleInteractionModal: React.FC<PuzzleInteractionModalProps> = ({ 
  viewingPuzzle, 
  onClose, 
  onVisitProfile 
}) => {
  const [interactionStage, setInteractionStage] = useState<'DETAIL' | 'INTERACT' | 'CHAT'>('DETAIL');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  // Find a specific "My Problem" puzzle to display on the right for interaction context
  // We'll override the author to represent "Me"
  const myProblemPuzzle = INITIAL_PUZZLES.find(p => p.type === PuzzleType.DIFFICULTY) || INITIAL_PUZZLES[0];
  const myPuzzleDisplayData = {
      ...myProblemPuzzle,
      author: { name: 'Me', avatar: 'https://picsum.photos/200' },
      title: '懂事崩',
      description: '委屈自己，顾全大局。'
  };

  const handleActionClick = (action: string) => {
    setSelectedAction(action);
    setAnimating(true);
    // Reset animation state to allow re-trigger
    setTimeout(() => setAnimating(false), 1500); 
  };

  // Helper to get animation class and emoji based on action
  const getInteractionEffects = () => {
      if (!selectedAction || !animating) return { leftClass: '', rightClass: '', emoji: null };
      
      switch(selectedAction) {
          case '贴贴':
              return { 
                  leftClass: 'animate-nuzzle-right', 
                  rightClass: 'animate-nuzzle-left',
                  emoji: '🥰' 
              };
          case '抱一抱':
              return { 
                  leftClass: 'animate-hug-squeeze', 
                  rightClass: 'animate-hug-squeeze',
                  emoji: '🫂' 
              };
          case '推一把':
              return { 
                  leftClass: 'animate-shove-receive', 
                  rightClass: 'animate-shove-give',
                  emoji: '🚀' 
              };
          case '赞一个':
              return { 
                  leftClass: 'animate-bounce', 
                  rightClass: 'animate-bounce-delay',
                  emoji: '🌟' 
              };
          default:
              return { leftClass: '', rightClass: '', emoji: null };
      }
  };

  const { leftClass, rightClass, emoji } = getInteractionEffects();

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn p-4 overflow-hidden"
      onClick={onClose}
    >
      <style>{`
        @keyframes nuzzleRight { 0%, 100% { transform: rotate(-5deg) translateX(0); } 50% { transform: rotate(5deg) translateX(20px); } }
        @keyframes nuzzleLeft { 0%, 100% { transform: rotate(5deg) translateX(0); } 50% { transform: rotate(-5deg) translateX(-20px); } }
        .animate-nuzzle-right { animation: nuzzleRight 1s ease-in-out infinite; }
        .animate-nuzzle-left { animation: nuzzleLeft 1s ease-in-out infinite; }
        @keyframes hugSqueeze { 0% { transform: scale(1); } 40% { transform: scale(0.9) translateX(10px); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-hug-squeeze { animation: hugSqueeze 0.8s ease-in-out; }
        @keyframes shoveGive { 0% { transform: translateX(0); } 20% { transform: translateX(-30px); } 50% { transform: translateX(50px); } 100% { transform: translateX(0); } }
        @keyframes shoveReceive { 0% { transform: translateX(0); } 50% { transform: translateX(-60px) rotate(-10deg); } 100% { transform: translateX(0); } }
        .animate-shove-give { animation: shoveGive 0.6s ease-in; }
        .animate-shove-receive { animation: shoveReceive 0.6s ease-out; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-bounce { animation: bounce 0.6s ease-in-out; }
        .animate-bounce-delay { animation: bounce 0.6s ease-in-out 0.1s; }
        @keyframes floatUp { 0% { opacity: 0; transform: translateY(20px) scale(0.5); } 50% { opacity: 1; transform: translateY(-40px) scale(1.5); } 100% { opacity: 0; transform: translateY(-80px) scale(1); } }
        .animate-emoji-float { animation: floatUp 1.2s ease-out forwards; }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
      `}</style>

      {/* STAGE 1: DETAIL VIEW */}
      {interactionStage === 'DETAIL' && (
         <div 
            className="relative w-full max-w-lg bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[3rem] p-6 flex flex-col items-center justify-center animate-popIn border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ minHeight: '550px' }}
            onClick={(e) => e.stopPropagation()}
         >
            {/* Navigation Bar inside Modal */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
                <button 
                    onClick={onClose}
                    className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/5 group"
                    title="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>

                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setInteractionStage('INTERACT');
                    }}
                    className="pointer-events-auto group flex items-center gap-2 px-4 py-2 bg-[#F36223]/10 hover:bg-[#F36223] rounded-full border border-[#F36223]/30 transition-all duration-300 backdrop-blur-md"
                >
                    <span className="text-xs font-bold text-[#F36223] group-hover:text-white transition-colors uppercase tracking-widest hidden sm:block">Bump</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#F36223] group-hover:text-white transition-colors group-hover:rotate-12 transform">
                         <path d="M9.5 7.5a1 1 0 00-1-1H6a1 1 0 00-1 1v2a1 1 0 01-2 0V7a1 1 0 00-1-1H1v4a1 1 0 001 1h1a1 1 0 010 2H1a1 1 0 00-1 1v4h4a1 1 0 001-1v-1a1 1 0 012 0v1a1 1 0 001 1h2.5v-4H10a1 1 0 010-2h.5V7.5z" opacity="0.8" />
                         <path d="M14.5 7.5a1 1 0 00-1-1H11v4h.5a1 1 0 010 2H11v4h2.5a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 010-2v-.5a1 1 0 012 0v.5a1 1 0 001 1h.5v-4h-2.5a1 1 0 00-1-1v-1a1 1 0 012 0v-1a1 1 0 00-1-1H16a1 1 0 00-1 1v1a1 1 0 01-2 0v-1a1 1 0 00-1-1h-.5v4h1a1 1 0 010 2h-1z" opacity="1" className="translate-x-[2px]"/>
                    </svg>
                </button>
            </div>

            {/* Puzzle Display Container */}
            <div className="relative flex-1 w-full flex items-center justify-center mt-8">
                <div className="relative">
                    <PuzzlePiece 
                        data={{...viewingPuzzle, rotation: 0}} 
                        scale={2.8} 
                        showAuthor={false} 
                        className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                    />
                    
                    {/* Embedded Info Overlay */}
                    <div className="absolute bottom-[12%] left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(onVisitProfile) onVisitProfile(viewingPuzzle.author);
                            }}
                            className="relative mb-2 transform hover:scale-110 transition-transform pointer-events-auto cursor-pointer"
                        >
                            <img 
                                src={viewingPuzzle.author?.avatar} 
                                alt={viewingPuzzle.author?.name} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover hover:ring-2 hover:ring-[#F36223] transition-all"
                            />
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#F36223] text-white text-[8px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow-md">
                                {viewingPuzzle.recommendationReason ? 'RECOMMENDED' : 'AUTHOR'}
                             </div>
                        </div>
                        {viewingPuzzle.recommendationReason && (
                            <div className="max-w-[180px] text-center mt-2">
                                <p className="text-[11px] font-serif-sc text-white/90 leading-snug drop-shadow-md italic">
                                    “{viewingPuzzle.recommendationReason}”
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* STAGE 2: INTERACT VIEW */}
      {interactionStage === 'INTERACT' && (
        <div 
           className="w-full max-w-4xl flex flex-col items-center animate-fadeIn py-4 relative"
           onClick={(e) => e.stopPropagation()}
        >
           <div className="absolute top-0 left-0 z-[60]">
               <button 
                    onClick={() => setInteractionStage('DETAIL')}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/5 group"
                    title="Back to Detail"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
           </div>

           <div className="flex gap-3 mb-6 relative z-50 flex-wrap justify-center mt-8">
              {['贴贴', '抱一抱', '推一把', '赞一个'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleActionClick(action)}
                  className={`px-6 py-2 rounded-full border-2 transition-all duration-300 font-serif-sc text-base font-bold
                    ${selectedAction === action 
                      ? 'bg-[#F36223] border-[#F36223] text-white shadow-[0_0_20px_rgba(243,98,35,0.5)] scale-110' 
                      : 'bg-black/50 border-gray-600 text-gray-300 hover:border-white hover:text-white backdrop-blur-md'
                    }
                  `}
                >
                  {action}
                </button>
              ))}
           </div>

           <div className="flex items-center justify-center gap-6 md:gap-12 relative w-full h-[350px]">
              {animating && emoji && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] text-6xl animate-emoji-float pointer-events-none drop-shadow-2xl">
                  {emoji}
                </div>
              )}

              <div className={`relative transition-all duration-500 ${leftClass}`}>
                 <PuzzlePiece 
                    data={{ ...viewingPuzzle, rotation: -5 }}
                    scale={1.8} 
                    showAuthor={true}
                 />
              </div>

              <div className={`relative transition-all duration-500 ${rightClass}`}>
                 <PuzzlePiece 
                    data={{ ...myPuzzleDisplayData, rotation: 5 }}
                    scale={1.8}
                    showAuthor={true}
                 />
              </div>
           </div>

           {selectedAction && (
             <button 
                onClick={() => setInteractionStage('CHAT')}
                className="mt-6 px-12 py-3 bg-white text-black text-lg rounded-full font-bold tracking-[0.2em] hover:bg-gray-200 hover:scale-105 transition-all animate-slideUp shadow-[0_0_40px_rgba(255,255,255,0.3)] z-50"
             >
                CONNECT
             </button>
           )}
        </div>
      )}

      {/* STAGE 3: CHAT VIEW */}
      {interactionStage === 'CHAT' && (
         <div 
           className="w-full max-w-5xl h-[650px] flex flex-col md:flex-row items-center justify-center gap-8 animate-popIn p-4"
           onClick={(e) => e.stopPropagation()}
         >
            {/* Left Side: Floating Puzzles */}
            <div className="w-full md:w-1/3 h-64 md:h-full relative hidden md:block">
               <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/5">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                     <div className="absolute top-[20%] left-[10%] animate-float-slow z-10 hover:z-30 hover:scale-110 transition-transform cursor-pointer">
                        <PuzzlePiece data={{...viewingPuzzle, rotation: -10}} scale={1.2} showAuthor={true} />
                     </div>
                     <div className="absolute bottom-[20%] right-[10%] animate-float-delayed z-20 hover:z-30 hover:scale-110 transition-transform cursor-pointer">
                        <PuzzlePiece data={{...myPuzzleDisplayData, rotation: 10}} scale={1.2} showAuthor={true} />
                     </div>
                  </div>
                  <p className="absolute bottom-6 left-0 w-full text-center text-white/30 text-xs font-serif-sc tracking-widest">
                     CONNECTIONS MADE
                  </p>
               </div>
            </div>

            {/* Right Side: Chat Interface */}
            <div className="w-full md:w-2/3 h-full bg-[#111] rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl relative">
               {/* Header */}
               <div className="bg-[#1A1A1A] p-5 flex items-center justify-between border-b border-gray-800">
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setInteractionStage('INTERACT')}
                        className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 text-gray-300 hover:text-white transition-all border border-white/10"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5" />
                        </svg>
                     </button>
                     <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-600">
                           <img src={viewingPuzzle.author?.avatar} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1A1A1A] rounded-full"></span>
                     </div>
                     <div>
                        <h3 className="text-white font-serif-sc font-bold text-lg">{viewingPuzzle.author?.name}</h3>
                        <p className="text-xs text-gray-500">Replied to your "{selectedAction}"</p>
                     </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>

               {/* Messages */}
               <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  <div className="flex justify-center">
                     <span className="text-[10px] text-gray-500 font-mono">Today, 10:23 AM</span>
                  </div>
                  <div className="flex justify-center">
                     <div className="flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-full border border-gray-800/50">
                        <span className="text-xl">{emoji}</span>
                        <span className="text-xs text-gray-400">You sent a "{selectedAction}"</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-4 animate-slideUp">
                     <img src={viewingPuzzle.author?.avatar} className="w-10 h-10 rounded-full mt-1" />
                     <div className="flex flex-col gap-1">
                         <span className="text-xs text-gray-500 ml-1">{viewingPuzzle.author?.name}</span>
                         <div className="bg-[#222] rounded-2xl rounded-tl-none px-5 py-4 max-w-md border border-gray-800 shadow-sm">
                            <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                               你好呀！很高兴收到你的{selectedAction}。我也经历过类似的困扰，如果你愿意的话，我们可以聊聊我是怎么走出第一步的？
                            </p>
                         </div>
                     </div>
                  </div>
               </div>

               {/* Input */}
               <div className="p-5 bg-[#1A1A1A] border-t border-gray-800">
                  <div className="flex gap-3">
                     <input 
                        type="text" 
                        placeholder="Type a message..."
                        className="flex-1 bg-black border border-gray-700 rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:border-[#F36223] focus:ring-1 focus:ring-[#F36223] transition-all placeholder-gray-600"
                     />
                     <button className="w-14 h-14 bg-[#F36223] rounded-full flex items-center justify-center text-white hover:bg-[#ff7a40] transition-colors shadow-lg hover:scale-105 transform duration-200">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 translate-x-0.5">
                         <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.89 28.89 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                       </svg>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
