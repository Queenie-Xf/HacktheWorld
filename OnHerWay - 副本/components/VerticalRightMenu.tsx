
import React from 'react';
import type { MyMapSubView } from '../types';

interface VerticalRightMenuProps {
  activeSubView: MyMapSubView;
  onSubViewChange: (view: MyMapSubView) => void;
  pendingActionsCount?: number;
  onCallStart: () => void;
}

export const VerticalRightMenu: React.FC<VerticalRightMenuProps> = ({
  activeSubView,
  onSubViewChange,
  pendingActionsCount,
  onCallStart
}) => {
  const navButtons: Array<{
    id: MyMapSubView;
    icon: React.ReactElement;
    tooltip: string;
    badge?: number;
  }> = [
    {
      id: 'map',
      tooltip: '拼图地图',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
          <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
          <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
        </svg>
      ),
    },
    {
      id: 'resources',
      tooltip: '能力星图',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'plan',
      tooltip: '行动清单',
      badge: pendingActionsCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'network',
      tooltip: '建联交流',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col justify-center h-full px-6 z-50 pointer-events-none">
      <div className="glass-panel-heavy rounded-full py-6 px-3 flex flex-col items-center gap-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto">

        {/* AI Call Button */}
        <button
          onClick={onCallStart}
          className="group relative w-12 h-12 flex items-center justify-center transition-all duration-500 rounded-full hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full transition-all duration-500 bg-transparent group-hover:bg-white/5"></div>

          <div className="relative z-10 transition-colors duration-300 text-gray-400 group-hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-1 glass-panel rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            <span className="text-xs font-bold tracking-widest uppercase text-white">AI 通话</span>
            <div className="absolute top-1/2 left-full w-4 h-[1px] bg-white/20"></div>
          </div>
        </button>

        {/* Divider */}
        <div className="h-[1px] bg-white/20 w-8 my-2"></div>

        {/* Navigation Buttons */}
        {navButtons.map((button) => {
          const isActive = activeSubView === button.id;

          return (
            <button
              key={button.id}
              onClick={() => onSubViewChange(button.id)}
              className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-500 rounded-full ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              {/* Active background glow */}
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isActive ? 'bg-brand-yellow/10' : 'bg-transparent group-hover:bg-white/5'
              }`}></div>

              {/* Spinning border for active state */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow"
                     style={{
                       background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, transparent 0%, #FDD140 50%, transparent 100%) border-box',
                       animationDuration: '3s'
                     }}>
                </div>
              )}

              {/* Icon */}
              <div className={`relative z-10 transition-colors duration-300 ${
                isActive
                  ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(253,209,64,0.6)]'
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {button.icon}
              </div>

              {/* Badge for pending actions */}
              {button.badge !== undefined && button.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-gray-900">
                  {button.badge > 9 ? '9+' : button.badge}
                </div>
              )}

              {/* Tooltip */}
              <div className="absolute right-full mr-4 px-3 py-1 glass-panel rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                <span className="text-xs font-bold tracking-widest uppercase text-white">{button.tooltip}</span>
                <div className="absolute top-1/2 left-full w-4 h-[1px] bg-white/20"></div>
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
};
