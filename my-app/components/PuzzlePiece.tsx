'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceType, ReflectionPiece } from '../lib/types';
import { COLORS, PuzzlePaths } from '../lib/constants';

interface PuzzlePieceProps {
  data: ReflectionPiece;
  onDragEnd?: (id: string, x: number, y: number) => void;
  static?: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ data, onDragEnd, static: isStatic }) => {
  const getPath = () => {
    switch (data.type) {
      case ExperienceType.DIFFICULTY: return PuzzlePaths.CORNER;
      case ExperienceType.PROBLEM: return PuzzlePaths.END;
      default: return PuzzlePaths.STRAIGHT;
    }
  };

  const getColor = () => COLORS[data.type];

  const pieceContent = (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d={getPath()}
          fill={getColor()}
          stroke="white"
          strokeWidth="2"
        />
        <foreignObject x="25" y="25" width="50" height="50">
          <div className="flex flex-col items-center justify-center h-full text-[8px] font-bold text-white text-center leading-tight">
            <span className="uppercase opacity-70 mb-1">{data.type}</span>
            <span className="line-clamp-2">{data.title}</span>
          </div>
        </foreignObject>
      </svg>
      
      {/* Tooltip on Hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-100 z-50">
        <p className="text-xs font-bold text-slate-800">{data.title}</p>
        <p className="text-[10px] text-slate-500">{data.date}</p>
      </div>
    </div>
  );

  if (isStatic) {
    return (
      <div 
        className="absolute puzzle-shadow group"
        style={{ width: 120, height: 120, left: data.x, top: data.y, transform: `rotate(${data.rotation}deg)` }}
      >
        {pieceContent}
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: data.x, y: data.y, rotate: data.rotation }}
      onDragEnd={(_, info) => onDragEnd && onDragEnd(data.id, info.point.x, info.point.y)}
      className="absolute cursor-grab active:cursor-grabbing puzzle-shadow group"
      style={{ width: 120, height: 120 }}
    >
      {pieceContent}
    </motion.div>
  );
};

export default PuzzlePiece;
