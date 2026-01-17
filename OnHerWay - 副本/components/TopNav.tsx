
import React from 'react';
import { ViewMode } from '../types';

interface TopNavProps {
  currentView: ViewMode;
  onSwitch: (view: ViewMode) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentView, onSwitch }) => {
  return (
    <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
      {/* Title - Hidden to make space for navigation */}
      <div className="opacity-0">
        <h1 className="text-2xl text-white font-serif-sc tracking-widest">MY WAY</h1>
      </div>

      {/* Right Side: View Switcher */}
      <div className="flex flex-col items-end space-y-4 pointer-events-auto">

        {/* View Switcher - Always visible */}
        <div className="flex bg-[#111] bg-opacity-80 backdrop-blur-md rounded-full border border-gray-700 p-1">
          <button
            onClick={() => onSwitch(ViewMode.MY_MAP)}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentView === ViewMode.MY_MAP
                ? 'bg-gray-200 text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            My Way
          </button>
          <button
            onClick={() => onSwitch(ViewMode.COMMUNITY)}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              currentView === ViewMode.COMMUNITY
                ? 'bg-pink-300 text-black shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Her Way 社区
          </button>
        </div>

      </div>
    </div>
  );
};
