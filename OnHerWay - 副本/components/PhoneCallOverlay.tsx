
import React, { useState, useEffect } from 'react';

interface PhoneCallOverlayProps {
  onClose: () => void;
}

export const PhoneCallOverlay: React.FC<PhoneCallOverlayProps> = ({ onClose }) => {
  const [inputText, setInputText] = useState("");
  // In a real implementation, this would be the history or streaming text from the user's voice/input
  const [userTranscript, setUserTranscript] = useState("");

  // Effect to simulate the "streaming" text updating as user types
  useEffect(() => {
    setUserTranscript(inputText);
  }, [inputText]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 bg-[#050505] animate-fadeIn">
       
       {/* Background Ambience - Subtle pulsing orb */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F36223] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
       </div>

       {/* Top Controls - Back Button */}
       <div className="absolute top-6 left-6 z-50">
          <button 
             onClick={onClose}
             className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 group"
             title="End Call / Return"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
             </svg>
          </button>
       </div>

       {/* Top Status (Visual decoration) */}
       <div className="relative z-10 flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">ON HER WAY LINE</span>
          </div>
          <span className="text-gray-600 text-[10px]">00:03</span>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center relative z-10 space-y-6">
          {/* AI Question - Visual Center */}
          <h2 className="text-3xl md:text-4xl font-serif-sc font-bold leading-relaxed text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-xl">
             比如你今天想和我分享什么？
          </h2>

          {/* User Transcript (Gray, Streaming Text) */}
          <div className="min-h-[80px] w-full px-4">
             <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed transition-all duration-200">
               {userTranscript || <span className="opacity-30">...</span>}
               {/* Blinking cursor effect */}
               <span className="inline-block w-0.5 h-5 ml-1 bg-[#F36223] align-middle animate-pulse"></span>
             </p>
          </div>
       </div>

       {/* Bottom Controls */}
       <div className="w-full max-w-lg flex flex-col items-center gap-8 relative z-10 mb-8">
          
          {/* Text Input Box */}
          <div className="w-full relative group">
             <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type to respond..."
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#F36223]/50 focus:ring-1 focus:ring-[#F36223]/50 transition-all text-center shadow-lg"
             />
          </div>

          {/* Hangup Button */}
          <button 
             onClick={onClose}
             className="w-16 h-16 bg-[#FF3B30] hover:bg-[#ff554a] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,59,48,0.3)] transform hover:scale-110 active:scale-95 transition-all duration-300"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 rotate-[135deg]">
               <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
             </svg>
          </button>
       </div>
    </div>
  );
};
