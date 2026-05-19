export interface Habit {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string; // ISO Date
  completedDates: string[]; // Array of YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  rating: number; // 1-5 score of self-discipline
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (user: UserState, habits: Habit[], journal: JournalEntry[]) => boolean;
}

export interface CardStats {
  str: number; // Will/attack
  int: number; // Focus/strategy
  agi: number; // Resilience/evasion
}

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardCollection = 'core' | 'historias-da-noite' | 'custom';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  collection: CardCollection;
  icon: string; // Emoji or simple visual rep
  image?: string; // Path or generated URL
  stats: CardStats;
  createdAt?: string;
  prompt?: string;
  imagePrompt?: string;
  aiProvider?: 'groq' | 'local';
  seed?: number;
}

export interface UserState {
  xp: number;
  level: number;
  name: string;
  credits: number; // Currency for Gacha (100 = 1 pull)
  inventory: string[]; // IDs of collected items
  lastBackupDate: string | null;
  mealsToday: number;
  lastMealDate: string | null; // YYYY-MM-DD
  mealHistory?: Record<string, number>; // YYYY-MM-DD -> count
}

export type Tab = 'habits' | 'dashboard' | 'journal' | 'profile' | 'dcc';

export interface DccCompletion {
  checkedLeft: boolean;
  checkedRight: boolean;
}

export type DccCompletionsState = Record<number, DccCompletion>;

