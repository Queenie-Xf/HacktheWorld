
import React from 'react';

export interface UserProfileData {
  name: string;
  avatar: string;
  tagline: string;
  identity: string;
  role: string;
  location: string;
  mood: string;
  goal: string;
  mission: string;
}

interface SidebarProps {
  user?: UserProfileData;
  onBack?: () => void;
}

const DEFAULT_USER: UserProfileData = {
  name: "一个世界玩家",
  avatar: "https://picsum.photos/200",
  tagline: "PERSONAL LOG",
  identity: "THINKER",
  role: "建筑设计师",
  location: "上海",
  mood: "有点微丝但充满希望",
  goal: "先活着吧",
  mission: "Build meaningful products"
};

export const Sidebar: React.FC<SidebarProps> = ({ user = DEFAULT_USER, onBack }) => {
  return (
    <div className="fixed top-24 left-8 w-80 bg-[#111] bg-opacity-90 backdrop-blur-md rounded-3xl border border-gray-800 p-6 z-40 text-gray-300 font-sans shadow-2xl transition-all duration-300">
      {/* Header Profile */}
      <div className="flex items-center space-x-4 mb-6 relative">
        {onBack && (
            <button 
                onClick={onBack}
                className="absolute -left-2 -top-2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 z-50 group shadow-lg"
                title="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5" />
                </svg>
            </button>
        )}

        <div className={`w-16 h-16 rounded-full bg-pink-200 overflow-hidden border-2 border-white/20 transition-transform ${onBack ? 'translate-x-4' : ''}`}>
           <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover grayscale contrast-125" />
        </div>
        <div className={`${onBack ? 'translate-x-2' : ''} transition-transform`}>
          <h2 className="text-white text-lg font-bold font-serif-sc">{user.name}</h2>
          <p className="text-xs tracking-widest text-gray-500">{user.tagline}</p>
        </div>
        <div className="ml-auto flex space-x-2 text-gray-500">
           <span>🌐</span>
           <span>{'<>'}</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6 border-b border-gray-800 pb-4">
        记录每天的反思，拼凑完整的人生地图。
      </p>

      {/* Identity Section */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Identity</h3>
        <div className="bg-[#1A1A1A] px-4 py-3 rounded-lg border border-gray-800 text-white font-medium tracking-wide">
          {user.identity}
        </div>
      </div>

      {/* Attribute Matrix */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Attribute_Matrix</h3>
        <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-4 grid grid-cols-2 gap-y-4 text-xs">
          <div className="flex flex-col">
             <span className="text-gray-500 mb-1 flex items-center"><span className="mr-1">⚙️</span> ROLE</span>
             <span className="text-white font-medium pl-5">{user.role}</span>
          </div>
          <div className="flex flex-col text-right">
             <span className="text-gray-500 mb-1 flex items-center justify-end"><span className="mr-1">📍</span> LOC</span>
             <span className="text-white font-medium">{user.location}</span>
          </div>
          <div className="flex flex-col col-span-2">
             <span className="text-gray-500 mb-1 flex items-center"><span className="mr-1">⚡</span> MOOD</span>
             <span className="text-white font-medium pl-5">{user.mood}</span>
          </div>
          <div className="flex flex-col col-span-2">
             <span className="text-gray-500 mb-1 flex items-center"><span className="mr-1">🎯</span> GOAL</span>
             <span className="text-white font-medium pl-5">{user.goal}</span>
          </div>
        </div>
      </div>

      {/* Current Mission */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Current_Mission</h3>
        <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-4 relative overflow-hidden group hover:border-gray-600 transition-colors">
          <p className="text-gray-500 text-xs mb-1">小目标是</p>
          <p className="text-white font-mono text-sm">{user.mission}</p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center opacity-50">
             <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Nodes */}
      <div>
         <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent_Nodes</h3>
            <span className="text-[10px] text-gray-600">⏱ LOG</span>
         </div>
         <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-4 space-y-3">
            <div className="flex items-center space-x-3">
               <div className="w-2 h-2 rounded-full bg-purple-500"></div>
               <div>
                 <p className="text-[10px] text-gray-500">2023.12</p>
                 <p className="text-xs text-white">Year End Reflection</p>
               </div>
            </div>
            <div className="flex items-center space-x-3">
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
               <div>
                 <p className="text-[10px] text-gray-500">2023.11</p>
                 <p className="text-xs text-white">Final Sprint</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
