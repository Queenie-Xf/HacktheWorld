
export enum PuzzleType {
  EXPERIENCE = 'EXPERIENCE', // Blue #9FD2E3
  DIFFICULTY = 'DIFFICULTY', // Red/Orange #F36223
  GOAL = 'GOAL',       // Yellow #FDD140
  LOCKED = 'LOCKED'
}

export interface PuzzleAuthor {
  name: string;
  avatar: string;
}

export interface PuzzleData {
  id: string;
  date: string;
  title: string;
  description: string;
  type: PuzzleType;
  rotation?: number; // Visual rotation in degrees
  shapeVariant?: 1 | 2 | 3 | 4; // Which SVG path to use
  x?: number; // For the map view
  y?: number; // For the map view
  author?: PuzzleAuthor;
}

export enum ViewMode {
  LANDING = 'LANDING',
  MY_MAP = 'MY_MAP',
  COMMUNITY = 'COMMUNITY',
  INSIGHT_SUMMARY = 'INSIGHT_SUMMARY',
  THEIR_MAP = 'THEIR_MAP'
}

export enum CommunityTab {
  EXPERIENCE = 'EXPERIENCE',
  DIFFICULTY = 'DIFFICULTY',
  GOAL = 'GOAL'
}

export type MyMapSubView = 'map' | 'plan' | 'resources' | 'network';
