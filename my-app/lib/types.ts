export enum ExperienceType {
  PROBLEM = 'problem', // Blue - End piece
  DIFFICULTY = 'difficulty', // Yellow - Corner
  EXPERIENCE = 'experience', // Green - Straight
}

export interface ReflectionPiece {
  id: string;
  type: ExperienceType;
  title: string;
  content: string;
  date: string;
  x: number;
  y: number;
  rotation: number;
}

export interface LifeExperience {
  id: string;
  title: string;
  description: string;
  year: string;
}

export interface SummaryPoint {
  id: string;
  type: ExperienceType;
  title: string;
  description: string;
}

export interface CommunityAction {
  id: string;
  action: string;
  reason: string;
  authorAvatar: string;
  authorId: string;
}

export interface PublicProfile {
  id: string;
  name: string;
  avatar: string;
  tags: {
    role_detail: string;
    location: string;
    experience: string;
    hassle: string;
    goal: string;
  };
  lifeTimeline: LifeExperience[];
  reflections: ReflectionPiece[];
}

export type AppStage = 'welcome' | 'incoming_call' | 'calling' | 'profile_card' | 'main_app';
export type InteractionActionType = 'stick' | 'hug' | 'push' | 'like';
