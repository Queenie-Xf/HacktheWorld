export interface ActionItem {
  id: string;
  title: string;
  description: string;
  tag: 'Career' | 'Mental' | 'Networking' | 'Skill';
  estimatedTimeMinutes: number;
  status: 'pending' | 'completed';
  createdAt: number;
  isShared: boolean;
  difficulty?: 'Low Friction' | 'Research' | 'Active';
  sourceInsightType?: 'Problem' | 'Goal' | 'Strength';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestedActions?: ActionItem[];
  timestamp: number;
}

export interface Post {
  id: string;
  userAvatar: string;
  userName: string;
  userTitle: string;
  content: string;
  actionTaken?: ActionItem;
  likes: number;
  comments: number;
  timeAgo: string;
  type: 'question' | 'success';
  category?: 'recommend' | 'hot' | 'friends';
}

export interface AIMentorResponse {
  empatheticResponse: string;
  suggestedActions?: {
    title: string;
    description: string;
    tag: string;
    estimatedTimeMinutes: number;
    difficulty: 'Low Friction' | 'Research' | 'Active';
  }[];
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  tags: string[];
  xp: number;
  location?: string;
  currentState?: string;
  coreValues?: string;
  role_detail?: string;
  experience?: string;
  hassle?: string;
  goal?: string;
}

export interface Insight {
  id: string;
  title: string;
  type: 'Problem' | 'Goal' | 'Strength';
  description: string;
}

export interface AnalysisResult {
  newTags: string[];
  insights: Insight[];
  summary: string;
}

export interface ResourceNode {
  id: string;
  label: string;
  type: 'Root' | 'Skill' | 'Connection' | 'Achievement';
  x: number;
  y: number;
}

export interface ResourceLink {
  source: string;
  target: string;
}

export type View = 'chat' | 'insight' | 'plan' | 'community' | 'network' | 'profile' | 'resources';

export type InsightCategory = 'flag' | 'question' | 'experience';

export interface ChatInsightSummary {
  flag: string;      // 你可能想立的flag - Goals/flags to set
  question: string;  // 你可能想提问 - Questions to ask
  experience: string; // 你可以分享的行动经验 - Experiences to share
}
