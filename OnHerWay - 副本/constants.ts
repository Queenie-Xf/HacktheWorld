
import { PuzzleType, PuzzleData } from './types';

export const COLORS = {
  [PuzzleType.EXPERIENCE]: '#9FD2E3', // Blue - Experience
  [PuzzleType.DIFFICULTY]: '#F36223', // Red/Orange - Problem/Difficulty
  [PuzzleType.GOAL]: '#FDD140',       // Yellow - Goal
  [PuzzleType.LOCKED]: '#E0E0E0',     // Greyish for locked
};

// SVG Paths for jagged puzzle shapes
export const PUZZLE_SHAPES = {
  1: "M10,10 L30,12 C35,5 45,5 50,12 L70,10 L72,30 C80,35 80,45 72,50 L70,70 L50,72 C45,80 35,80 30,72 L10,70 L8,50 C0,45 0,35 8,30 Z",
  2: "M10,10 L35,8 C40,0 60,0 65,8 L90,10 L92,35 C100,40 100,60 92,65 L90,90 L65,92 C60,100 40,100 35,92 L10,90 L8,65 C0,60 0,40 8,35 Z",
  3: "M5,5 L30,5 C35,15 45,15 50,5 L75,5 L75,30 C65,35 65,45 75,50 L75,75 L50,75 C45,65 35,65 30,75 L5,75 L5,50 C15,45 15,35 5,30 Z",
  4: "M15,15 L40,10 C45,0 55,0 60,10 L85,15 L90,40 C100,45 100,55 90,60 L85,85 L60,90 C55,100 45,100 40,90 L15,85 L10,60 C0,55 0,45 10,40 Z",
};

// Layout Logic:
// widely scattered, mixed colors, non-linear timeline.
// Coordinates are spread out (approx -500 to +600 range) to prevent overlap.

export const INITIAL_PUZZLES: PuzzleData[] = [
  // --- TOP LEFT REGION (Mixed) ---
  {
    id: 'e1',
    date: '2023.03.12',
    title: '独自看海',
    description: '买了一张单程票，听了一整晚海浪，孤独感反而治愈了我。',
    type: PuzzleType.EXPERIENCE,
    shapeVariant: 1,
    rotation: -12,
    x: -380, y: -350,
    author: { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=e1' }
  },
  {
    id: 'g6',
    date: '2026.05.01',
    title: '学会拒绝',
    description: '建立边界感，不再做老好人，把精力留给自己。',
    type: PuzzleType.GOAL,
    shapeVariant: 2,
    rotation: -5,
    x: -200, y: -480, 
    author: { name: 'Bard', avatar: 'https://i.pravatar.cc/150?u=g6' }
  },
  {
    id: 'd1',
    date: '2023.11.05',
    title: '深夜崩溃',
    description: '看着天花板流泪到天亮，这种无力感真的很窒息。',
    type: PuzzleType.DIFFICULTY,
    shapeVariant: 4,
    rotation: 8,
    x: -550, y: -150, 
    author: { name: 'Olivia', avatar: 'https://i.pravatar.cc/150?u=d3' }
  },

  // --- TOP RIGHT REGION (Mixed) ---
  {
    id: 'd3',
    date: '2023.08.10',
    title: '职场背锅',
    description: '明明不是我的错却要道歉，成年人的世界只有利弊。',
    type: PuzzleType.DIFFICULTY,
    shapeVariant: 2,
    rotation: 15,
    x: 450, y: -300,
    author: { name: 'Anna', avatar: 'https://i.pravatar.cc/150?u=d1' }
  },
  {
    id: 'e4',
    date: '2023.09.15',
    title: '尝试Vlog',
    description: '对着镜头说话很尴尬，但记录当下很有成就感。',
    type: PuzzleType.EXPERIENCE,
    shapeVariant: 3,
    rotation: -8,
    x: 250, y: -150,
    author: { name: 'Jessica', avatar: 'https://i.pravatar.cc/150?u=e3' }
  },
  {
    id: 'g1',
    date: '2024.10.01',
    title: '存够十万',
    description: '强制储蓄，建立F*ck Money，为了随时辞职的底气。',
    type: PuzzleType.GOAL,
    shapeVariant: 3,
    rotation: 6,
    x: 650, y: -80,
    author: { name: 'Ryan', avatar: 'https://i.pravatar.cc/150?u=g1' }
  },

  // --- CENTER REGION (Mixed "Hotspot") ---
  {
    id: 'd2',
    date: '2024.03.20',
    title: '容貌焦虑',
    description: '照镜子总觉得哪里不够好，忘记了健康自信才是美。',
    type: PuzzleType.DIFFICULTY,
    shapeVariant: 3,
    rotation: -4,
    x: -50, y: -80,
    author: { name: 'Echo', avatar: 'https://i.pravatar.cc/150?u=d6' }
  },
  {
    id: 'd5',
    date: '2024.02.14',
    title: '社交压力',
    description: '朋友圈大家光鲜亮丽，只有我还在原地踏步。',
    type: PuzzleType.DIFFICULTY,
    shapeVariant: 1,
    rotation: 5,
    x: 180, y: -350,
    author: { name: 'Lucas', avatar: 'https://i.pravatar.cc/150?u=d4' }
  },
  {
    id: 'e5',
    date: '2024.01.20',
    title: '重新运动',
    description: '跑完三公里气喘吁吁，流汗的感觉让我觉得我还活着。',
    type: PuzzleType.EXPERIENCE,
    shapeVariant: 2,
    rotation: 10,
    x: 220, y: 150,
    author: { name: 'Leo', avatar: 'https://i.pravatar.cc/150?u=e6' }
  },

  // --- BOTTOM LEFT REGION (Mixed) ---
  {
    id: 'e2',
    date: '2023.05.20',
    title: '重拾画笔',
    description: '周末午后涂了一幅很丑的画，但开心得像个孩子。',
    type: PuzzleType.EXPERIENCE,
    shapeVariant: 2,
    rotation: -3,
    x: -300, y: 180,
    author: { name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=e2' }
  },
  {
    id: 'e3',
    date: '2023.12.24',
    title: '为自己做饭',
    description: '第一次完整的圣诞晚餐，牛排煎老了，但仪式感拉满。',
    type: PuzzleType.EXPERIENCE,
    shapeVariant: 4,
    rotation: 12,
    x: -500, y: 350,
    author: { name: 'David', avatar: 'https://i.pravatar.cc/150?u=e4' }
  },
  {
    id: 'g3',
    date: '2025.06.15',
    title: '练出马甲线',
    description: '饮食控制加力量训练，想要掌控自己的身体。',
    type: PuzzleType.GOAL,
    shapeVariant: 1,
    rotation: -6,
    x: -180, y: 450,
    author: { name: 'Daniel', avatar: 'https://i.pravatar.cc/150?u=g3' }
  },
  
  // --- BOTTOM RIGHT REGION (Mixed) ---
  {
    id: 'd4',
    date: '2024.05.01',
    title: '项目被毙',
    description: '三个月的方案被一句话否决，努力好像打水漂了。',
    type: PuzzleType.DIFFICULTY,
    shapeVariant: 1,
    rotation: -10,
    x: 420, y: 100,
    author: { name: 'Job', avatar: 'https://i.pravatar.cc/150?u=d7' }
  },
  {
    id: 'g5',
    date: '2026.01.01',
    title: '拥有工作室',
    description: '洒满阳光的房间，不为甲方只为热爱的生活。',
    type: PuzzleType.GOAL,
    shapeVariant: 1,
    rotation: -9,
    x: 350, y: 400,
    author: { name: 'Jacob', avatar: 'https://i.pravatar.cc/150?u=g5' }
  },
  {
    id: 'g4',
    date: '2025.12.25',
    title: '带爸妈旅行',
    description: '趁他们还走得动，带他们去看看外面的世界。',
    type: PuzzleType.GOAL,
    shapeVariant: 2,
    rotation: 4,
    x: 580, y: 550,
    author: { name: 'Emma', avatar: 'https://i.pravatar.cc/150?u=g4' }
  },
  {
    id: 'g2',
    date: '2025.02.01',
    title: '雅思上岸',
    description: '背单词很枯燥，但想到异国街头漫步就充满了动力。',
    type: PuzzleType.GOAL,
    shapeVariant: 4,
    rotation: -7,
    x: 100, y: 600,
    author: { name: 'Chloe', avatar: 'https://i.pravatar.cc/150?u=g2' }
  },
   {
    id: 'g7',
    date: '2026.11.11',
    title: '出版一本书',
    description: '整理这几年的日记，送给自己三十岁的礼物。',
    type: PuzzleType.GOAL,
    shapeVariant: 3,
    rotation: 3,
    x: -50, y: 750, // Far bottom
    author: { name: 'Writer', avatar: 'https://i.pravatar.cc/150?u=g7' }
  }
];
