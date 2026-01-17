import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
  pendingActionsCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  setActiveView,
  pendingActionsCount = 0,
}) => {
  const navItems: { id: View; label: string; icon: React.ReactElement }[] = [
    {
      id: 'chat',
      label: 'AI 导师',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'insight',
      label: '自我洞察',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a7 7 0 0 0-4 12c.6.5 1 1.2 1 2v2h6v-2c0-.8.4-1.5 1-2a7 7 0 0 0-4-12z" />
          <path d="M9 22h6" />
        </svg>
      ),
    },
    {
      id: 'plan',
      label: '行动清单',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      id: 'resources',
      label: '能力星图',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen w-full font-sans flex flex-col md:flex-row max-w-7xl mx-auto overflow-hidden relative">
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star opacity-40 animate-pulse-slow"
            style={{
              width: Math.random() < 0.5 ? '1px' : '2px',
              height: Math.random() < 0.5 ? '1px' : '2px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 10 + 's',
            }}
          />
        ))}
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="hidden md:flex flex-col justify-center h-full px-6 z-50">
        <div className="glass-panel-heavy rounded-full py-6 px-3 flex flex-col items-center gap-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10">

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
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
                  {React.cloneElement(item.icon, { width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)}
                </div>

                {/* Badge for pending actions */}
                {item.id === 'plan' && pendingActionsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-gray-900">
                    {pendingActionsCount > 9 ? '9+' : pendingActionsCount}
                  </div>
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-4 px-3 py-1 glass-panel rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  <span className="text-xs font-bold tracking-widest uppercase text-white">{item.label}</span>
                  <div className="absolute top-1/2 right-full w-4 h-[1px] bg-white/20"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent">
        <div className="md:hidden h-14 glass-panel flex items-center justify-between px-6 flex-shrink-0 z-20 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-orange to-brand-yellow flex items-center justify-center text-space-950 font-bold font-serif text-xs">
            OHW
          </div>
          <h1 className="font-serif text-sm font-bold text-white tracking-widest">ON HER WAY</h1>
          <div className="w-8"></div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative">{children}</div>
      </div>

      <div className="md:hidden fixed bottom-6 left-4 right-4 h-16 rounded-2xl glass-panel-heavy z-50 flex items-center justify-between px-2 shadow-2xl shadow-black/50 border border-white/15">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex-1 flex flex-col items-center justify-center h-full relative group"
            >
              {isActive && (
                <div className="absolute bottom-0 w-8 h-8 bg-gradient-to-t from-brand-yellow/20 to-transparent blur-md"></div>
              )}
              {isActive && (
                <div className="absolute bottom-0 w-4 h-0.5 bg-brand-yellow rounded-full shadow-[0_0_10px_rgba(253,209,64,1)]"></div>
              )}

              <div className={`transition-all duration-300 ${isActive ? 'text-brand-yellow -translate-y-1' : 'text-white/40'}`}>
                {React.cloneElement(item.icon, { width: 20, height: 20 } as React.SVGProps<SVGSVGElement>)}
              </div>

              <span
                className={`text-[9px] mt-1 font-medium tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-transparent'}`}
              >
                {isActive ? item.label.slice(0, 2) : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
