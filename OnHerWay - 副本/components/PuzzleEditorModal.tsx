
import React, { useState } from 'react';
import { PuzzleData, PuzzleType } from '../types';
import { PuzzlePiece } from './PuzzlePiece';

interface PuzzleEditorModalProps {
  initialType: PuzzleType;
  initialContent: string;
  initialTitle?: string;
  onClose: () => void;
  onPublish: (published: { title: string; description: string; type: PuzzleType }) => void;
}

export const PuzzleEditorModal: React.FC<PuzzleEditorModalProps> = ({
  initialType,
  initialContent,
  initialTitle = "我的新拼图",
  onClose,
  onPublish
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialContent);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate network request and success animation sequence
    setTimeout(() => {
        setIsPublishing(false);
        setIsSuccess(true);
        // Wait for checkmark animation before closing/navigating
        setTimeout(() => {
            onPublish({ title, description, type: initialType });
        }, 1200);
    }, 1000);
  };

  // Mock data for preview
  const previewPuzzle: PuzzleData = {
      id: 'preview',
      date: '2024.NOW',
      title: title,
      description: description,
      type: initialType,
      shapeVariant: 1,
      rotation: 0,
      author: { name: 'Me', avatar: 'https://picsum.photos/200' } // Placeholder for current user
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fadeIn p-4 overflow-hidden"
      onClick={onClose}
    >
      <style>{`
        @keyframes drawCheck {
          0% { stroke-dasharray: 0, 100; opacity: 0; }
          100% { stroke-dasharray: 100, 100; opacity: 1; }
        }
        .animate-check {
          animation: drawCheck 0.6s ease-out forwards;
        }
        @keyframes popScale {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-scale {
            animation: popScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      <div 
         className="relative w-full max-w-lg bg-[#111] border border-gray-800 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl animate-popIn"
         onClick={(e) => e.stopPropagation()}
         style={{ minHeight: '400px', justifyContent: isSuccess ? 'center' : 'flex-start' }}
      >
         {isSuccess ? (
             <div className="flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)] animate-pop-scale">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                         <path className="animate-check" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" strokeDasharray="100" />
                      </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-serif-sc text-white font-bold mb-2 animate-slideUp">发布成功</h3>
                <p className="text-gray-400 text-sm animate-slideUp" style={{ animationDelay: '0.1s' }}>正在返回拼图地图...</p>
             </div>
         ) : (
            <>
                <h2 className="text-2xl font-serif-sc text-white mb-6">编辑拼图</h2>
                
                <div className="relative w-full flex justify-center mb-8">
                    {/* We render the puzzle piece as a background, and overlay inputs on top */}
                    <div className="relative transform scale-125">
                        <PuzzlePiece 
                            data={{...previewPuzzle, title: '', description: ''}} // Hide text in preview, we use inputs
                            scale={2.2} 
                            className="opacity-100"
                        />
                        
                        {/* Input Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20">
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-center text-lg font-serif-sc font-bold mb-2 focus:outline-none border-b border-transparent focus:border-white/30 transition-colors placeholder-white/50"
                                placeholder="输入标题..."
                                style={{ color: initialType === PuzzleType.DIFFICULTY ? 'white' : 'black' }}
                            />
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-24 bg-transparent text-center text-xs font-medium resize-none focus:outline-none rounded-lg p-1 border border-transparent focus:bg-white/10 transition-colors placeholder-white/50"
                                placeholder="写下你的想法..."
                                style={{ color: initialType === PuzzleType.DIFFICULTY ? 'white' : 'black' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all font-medium"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex-1 py-3 rounded-full bg-[#F36223] text-white hover:bg-[#ff7a40] transition-all font-bold shadow-lg flex items-center justify-center"
                    >
                        {isPublishing ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            '发布拼图'
                        )}
                    </button>
                </div>
            </>
         )}
      </div>
    </div>
  );
};
