
import React from 'react';
import { PuzzleData, PuzzleType } from '../types';
import { COLORS, PUZZLE_SHAPES } from '../constants';

interface PuzzlePieceProps {
  data: PuzzleData;
  isLocked?: boolean;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  showAuthor?: boolean;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ 
  data, 
  isLocked = false, 
  scale = 1,
  className = "",
  style,
  showAuthor = false
}) => {
  const bgColor = COLORS[data.type];
  const textColor = data.type === PuzzleType.DIFFICULTY ? '#FFFFFF' : '#000000';
  const shapePath = PUZZLE_SHAPES[data.shapeVariant || 1];
  
  // Base dimensions of the SVG viewbox
  const baseSize = 200; 

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{
        width: baseSize * scale,
        height: baseSize * scale,
        transform: `rotate(${data.rotation || 0}deg)`,
        filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.4))',
        ...style
      }}
    >
      {/* SVG Shape Background */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <path 
          d={shapePath} 
          fill={bgColor} 
          stroke="none"
        />
        {/* Texture overlay */}
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.15" style={{ mixBlendMode: 'multiply'}} />
        {/* Inner glow/highlight for depth */}
        <path d={shapePath} fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {/* Author Avatar Overlay (Moved to Top Left Corner) */}
      {showAuthor && data.author && (
        <div className="absolute top-2 left-6 z-20">
          <img 
            src={data.author.avatar} 
            alt={data.author.name}
            className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover transform hover:scale-110 transition-transform duration-200"
            title={data.author.name}
          />
        </div>
      )}

      {/* Content Container - Centered within the shape - Enforcing strict boundaries */}
      {isLocked ? (
        <div className="relative z-10 text-white flex flex-col items-center justify-center opacity-50">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      ) : (
        <div 
          className="relative z-10 flex flex-col items-center text-center justify-center overflow-hidden"
          style={{ 
            color: textColor,
            width: '55%',  // Tighter constraint (55% instead of 60%) to prevent jagged edge overlap
            height: '55%', 
          }}
        >
          {/* Content Layout - Strict clamping */}
          <div className="text-[8px] opacity-70 mb-1 font-sans tracking-wide uppercase shrink-0 w-full truncate border-b border-current/20 pb-0.5">
            {data.date}
          </div>
          <h3 className="text-xs md:text-sm font-serif-sc font-bold mb-1 leading-tight tracking-tight w-full line-clamp-2">
            {data.title}
          </h3>
          <p className="text-[9px] leading-tight font-medium opacity-90 line-clamp-3 w-full">
            {data.description}
          </p>
        </div>
      )}
    </div>
  );
};
