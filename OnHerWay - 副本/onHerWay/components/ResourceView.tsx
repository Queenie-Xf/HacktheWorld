import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActionItem, ResourceLink, ResourceNode, UserProfile } from '../types';

interface ResourceViewProps {
  profile: UserProfile;
  completedActions: ActionItem[];
}

export const ResourceView: React.FC<ResourceViewProps> = ({ profile, completedActions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const baseGraphData = useMemo(() => {
    const nodes: ResourceNode[] = [];
    const links: ResourceLink[] = [];

    const cx = 50;
    const cy = 50;
    const RADIUS = { ROOT: 0, SKILL: 18, NETWORK: 30, ACTION: 42 };

    nodes.push({ id: 'root', label: '我', type: 'Root', x: cx, y: cy });

    const totalSkills = profile.tags.length;
    profile.tags.forEach((tag, i) => {
      const angle = (i / totalSkills) * 2 * Math.PI;
      const x = cx + Math.cos(angle) * RADIUS.SKILL;
      const y = cy + Math.sin(angle) * RADIUS.SKILL;
      nodes.push({ id: `skill_${i}`, label: tag, type: 'Skill', x, y });
      links.push({ source: 'root', target: `skill_${i}` });
    });

    const mockConnections = ['导师 Sarah', 'UX 小组', '校友网', '设计 DAO'];
    const totalNet = mockConnections.length;
    mockConnections.forEach((person, i) => {
      const angle = (i / totalNet) * 2 * Math.PI + Math.PI / 4;
      const x = cx + Math.cos(angle) * RADIUS.NETWORK;
      const y = cy + Math.sin(angle) * RADIUS.NETWORK;
      nodes.push({ id: `conn_${i}`, label: person, type: 'Connection', x, y });
      links.push({ source: 'root', target: `conn_${i}` });
    });

    const totalActions = completedActions.length;
    completedActions.forEach((action, i) => {
      const angle = (i / totalActions) * 2 * Math.PI + Math.PI / 2;
      const x = cx + Math.cos(angle) * RADIUS.ACTION;
      const y = cy + Math.sin(angle) * RADIUS.ACTION;
      const nodeId = `action_${i}`;
      nodes.push({ id: nodeId, label: action.title, type: 'Achievement', x, y });

      const matchingSkillNode = nodes.find(
        (n) => n.type === 'Skill' && action.title.toLowerCase().includes(n.label.toLowerCase()),
      );
      if (matchingSkillNode) {
        links.push({ source: matchingSkillNode.id, target: nodeId });
      } else {
        links.push({ source: 'root', target: nodeId });
      }
    });

    return { nodes, links };
  }, [profile.tags, completedActions]);

  const physicsState = useRef<{ [id: string]: { x: number; y: number; vx: number; vy: number } }>({});
  const rotationRef = useRef(0);
  const [animatedNodes, setAnimatedNodes] = useState<ResourceNode[]>(baseGraphData.nodes);

  useEffect(() => {
    baseGraphData.nodes.forEach((n) => {
      if (!physicsState.current[n.id]) {
        physicsState.current[n.id] = { x: n.x, y: n.y, vx: 0, vy: 0 };
      }
    });
    setAnimatedNodes(baseGraphData.nodes);
  }, [baseGraphData]);

  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      rotationRef.current += 0.001;

      const mx = ((mouseRef.current.x - rect.left) / rect.width) * 100;
      const my = ((mouseRef.current.y - rect.top) / rect.height) * 100;

      const newNodes = baseGraphData.nodes.map((baseNode) => {
        const state = physicsState.current[baseNode.id] || { x: baseNode.x, y: baseNode.y, vx: 0, vy: 0 };

        const dxBase = baseNode.x - 50;
        const dyBase = baseNode.y - 50;
        const distance = Math.sqrt(dxBase * dxBase + dyBase * dyBase);
        const originalAngle = Math.atan2(dyBase, dxBase);

        const targetAngle = originalAngle + rotationRef.current;
        const targetX = 50 + Math.cos(targetAngle) * distance;
        const targetY = 50 + Math.sin(targetAngle) * distance;

        const SPRING_STIFFNESS = 0.008;
        const DAMPING = 0.94;
        const REPULSION_RADIUS = 25;
        const REPULSION_FORCE = 0.3;

        const axSpring = (targetX - state.x) * SPRING_STIFFNESS;
        const aySpring = (targetY - state.y) * SPRING_STIFFNESS;

        let axRepel = 0;
        let ayRepel = 0;
        const dxMouse = state.x - mx;
        const dyMouse = state.y - my;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < REPULSION_RADIUS) {
          const force = (1 - distMouse / REPULSION_RADIUS) * REPULSION_FORCE;
          axRepel = (dxMouse / distMouse) * force;
          ayRepel = (dyMouse / distMouse) * force;
        }

        state.vx = (state.vx + axSpring + axRepel) * DAMPING;
        state.vy = (state.vy + aySpring + ayRepel) * DAMPING;
        state.x += state.vx;
        state.y += state.vy;

        physicsState.current[baseNode.id] = state;

        return { ...baseNode, x: state.x, y: state.y };
      });

      setAnimatedNodes(newNodes);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [baseGraphData.nodes, baseGraphData.links]);

  const nodeMap = useMemo(() => {
    const map: Record<string, ResourceNode> = {};
    animatedNodes.forEach((n) => (map[n.id] = n));
    return map;
  }, [animatedNodes]);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] rounded-full border border-[#9FD2E3]/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-[#6D6D6D]/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84%] h-[84%] rounded-full border border-[#F36223]/20"></div>
      </div>

      <div className="absolute top-0 left-0 p-8 z-20 pointer-events-none">
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          能力星图
        </h1>
        <p className="text-[#9FD2E3]/70 text-sm mt-1 max-w-md font-light">你的无限宇宙。</p>
      </div>

      <div className="flex-1 w-full h-full relative z-10 origin-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {baseGraphData.links.map((link, i) => {
            const source = nodeMap[link.source];
            const target = nodeMap[link.target];
            if (!source || !target) return null;

            return (
              <line
                key={i}
                x1={`${source.x}%`}
                y1={`${source.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#6D6D6D"
                strokeWidth="0.5"
                className="opacity-40"
              />
            );
          })}
        </svg>

        {animatedNodes.map((node) => {
          let sizeClass = 'w-3 h-3';
          if (node.type === 'Root') sizeClass = 'w-12 h-12';
          else if (node.type === 'Skill') sizeClass = 'w-5 h-5';
          else if (node.type === 'Achievement') sizeClass = 'w-6 h-6';

          const bgClass =
            node.type === 'Root'
              ? 'bg-[#FDD140] shadow-[0_0_50px_rgba(253,209,64,0.6)]'
              : node.type === 'Skill'
                ? 'bg-[#9FD2E3] shadow-[0_0_20px_rgba(159,210,227,0.6)]'
                : node.type === 'Connection'
                  ? 'bg-[#6D6D6D] shadow-[0_0_15px_rgba(109,109,109,0.5)]'
                  : 'bg-[#F36223] shadow-[0_0_25px_rgba(243,98,35,0.6)]';

          const zIndex = node.type === 'Root' ? 'z-30' : 'z-20';

          return (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group cursor-pointer ${sizeClass} ${zIndex}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${bgClass}`}>
                <div className="absolute inset-[20%] bg-white rounded-full opacity-30 blur-[1px]"></div>
              </div>

              <div
                className={`
                absolute top-full left-1/2 transform -translate-x-1/2 mt-3 
                text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm backdrop-blur-none
                transition-all duration-300 pointer-events-none whitespace-nowrap
                ${
                  node.type === 'Root'
                    ? 'text-[#FDD140] font-bold tracking-[0.2em]'
                    : 'text-white/40 group-hover:text-white group-hover:bg-[#000000]/80 group-hover:border group-hover:border-white/20'
                }
              `}
              >
                {node.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-24 md:bottom-8 right-8 flex flex-col gap-3 z-20 glass-panel p-4 rounded-xl pointer-events-none border-white/10 bg-[#000000]/50">
        <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#9FD2E3] shadow-[0_0_8px_rgba(159,210,227,0.8)]"></span> 技能
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#6D6D6D] shadow-[0_0_8px_rgba(109,109,109,0.8)]"></span> 人脉
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#F36223] shadow-[0_0_8px_rgba(243,98,35,0.8)]"></span> 行动
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#FDD140] shadow-[0_0_8px_rgba(253,209,64,0.8)]"></span> 我
        </div>
      </div>
    </div>
  );
};

