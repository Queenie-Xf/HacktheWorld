
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_PUZZLES } from '../constants';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzleType, PuzzleData } from '../types';

interface MapCanvasProps {
  puzzles?: PuzzleData[];
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ puzzles = INITIAL_PUZZLES }) => {
  const [scale, setScale] = useState(0.85); // Zoomed out to show the scattered collage
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Local state to handle moving puzzles around
  const [localPuzzles, setLocalPuzzles] = useState<PuzzleData[]>(puzzles);

  // Interaction State
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Sync props to local state
  useEffect(() => {
    setLocalPuzzles(puzzles);
  }, [puzzles]);

  // Constraints
  const MIN_SCALE = 0.3;
  const MAX_SCALE = 2.5;
  const BOUNDS = 3000; 

  // Locked puzzles (placeholders)
  const lockedPuzzles = [
    { id: 'l1', x: -650, y: -250 },
    { id: 'l2', x: 680, y: 450 },
    { id: 'l3', x: 0, y: 850 },
  ];

  // Auto-center Logic (Intro Animation)
  useEffect(() => {
    if (hasUserInteracted || localPuzzles.length === 0) return;

    if (containerRef.current) {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        
        const startX = screenW / 2 + 50;
        const startY = screenH / 2 + 50;
        
        const endX = screenW / 2;
        const endY = screenH / 2;

        setPosition({ x: startX, y: startY });

        let startTime: number | null = null;
        const duration = 2000;

        const animateScroll = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            
            const currentX = startX + (endX - startX) * ease;
            const currentY = startY + (endY - startY) * ease;

            setPosition({ x: currentX, y: currentY });

            if (progress < 1 && !hasUserInteracted) {
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animateScroll);

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }
  }, [hasUserInteracted, localPuzzles]);

  const handleWheel = (e: React.WheelEvent) => {
    setHasUserInteracted(true);
    if (!containerRef.current) return;

    const zoomSensitivity = 0.0008;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(MIN_SCALE, scale + delta), MAX_SCALE);

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldX = (mouseX - position.x) / scale;
    const worldY = (mouseY - position.y) / scale;

    const newX = mouseX - worldX * newScale;
    const newY = mouseY - worldY * newScale;
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // --- Canvas-Level Pan Logic ---
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    setHasUserInteracted(true);
    // Only start map drag if we aren't already dragging a piece
    if (!draggingPieceId) {
        setIsDraggingMap(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grabbing';
        }
    }
  };

  // --- Item-Level Drag Logic ---
  const handlePieceMouseDown = (e: React.MouseEvent, id: string) => {
    // CRITICAL: Stop propagation so the container doesn't think we are panning the map
    e.stopPropagation(); 
    e.preventDefault();

    setHasUserInteracted(true);
    setDraggingPieceId(id);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    
    // Optional: cursor feedback
    if (containerRef.current) {
        containerRef.current.style.cursor = 'move';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    // Branch 1: Dragging a Puzzle Piece (Item Level)
    if (draggingPieceId) {
        // We must divide by scale so the piece moves 1:1 with the mouse pointer
        // regardless of the current zoom level.
        const worldDx = dx / scale;
        const worldDy = dy / scale;

        setLocalPuzzles(prev => prev.map(p => {
            if (p.id === draggingPieceId) {
                return {
                    ...p,
                    x: (p.x || 0) + worldDx,
                    y: (p.y || 0) + worldDy
                };
            }
            return p;
        }));
    } 
    // Branch 2: Panning the Map (Canvas Level)
    else if (isDraggingMap) {
        let newX = position.x + dx;
        let newY = position.y + dy;
        
        if (newX > BOUNDS) newX = BOUNDS;
        if (newX < -BOUNDS) newX = -BOUNDS;
        if (newY > BOUNDS) newY = BOUNDS;
        if (newY < -BOUNDS) newY = -BOUNDS;

        setPosition({ x: newX, y: newY });
    } else {
        // If simply moving mouse without clicking, do nothing
        return;
    }

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDraggingMap(false);
    setDraggingPieceId(null);
    if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden z-10 touch-none bg-transparent"
      style={{ cursor: 'grab', userSelect: 'none' }}
      onWheel={handleWheel}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="absolute w-full h-full transform-gpu will-change-transform origin-top-left"
        // Note: We remove transition on the map container when dragging the map for instant response
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
          transition: isDraggingMap ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Render Active Puzzles */}
        {localPuzzles.map(puzzle => {
            const isDragging = draggingPieceId === puzzle.id;
            return (
              <div
                key={puzzle.id}
                // Z-Index Management: Boost active piece to 50, others stay at 20
                className={`absolute ${isDragging ? 'z-50' : 'z-20 hover:z-40'}`}
                style={{ 
                   left: puzzle.x, 
                   top: puzzle.y,
                   transform: `translate(-50%, -50%) rotate(${puzzle.rotation || 0}deg) scale(${isDragging ? 1.1 : 1})`,
                   // CRITICAL: Disable transition when dragging to prevent "rubber band" lag
                   transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} 
                onMouseDown={(e) => handlePieceMouseDown(e, puzzle.id)}
              >
                 <PuzzlePiece 
                    data={puzzle} 
                    className={isDragging ? 'drop-shadow-2xl' : ''}
                 />
              </div>
            );
        })}

        {/* Render Locked Puzzles */}
        {lockedPuzzles.map((pos, idx) => (
             <PuzzlePiece
             key={`locked-${idx}`}
             data={{
                 id: `locked-${idx}`,
                 date: '',
                 title: '',
                 description: '',
                 type: PuzzleType.LOCKED,
                 shapeVariant: idx % 2 === 0 ? 1 : 4 as any,
                 rotation: 0
             }}
             isLocked={true}
             className="absolute opacity-40 z-10 pointer-events-none"
             style={{ 
                 left: pos.x, 
                 top: pos.y,
                 transform: `translate(-50%, -50%)`
            }}
           />
        ))}
      </div>
      
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)', 
             backgroundSize: `${200 * scale}px ${200 * scale}px`,
             backgroundPosition: `${position.x}px ${position.y}px`
           }}
      />
    </div>
  );
};
