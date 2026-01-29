export interface Habit {
  id: string;
  title: string;
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
  str: number; // Vontade/Ataque
  int: number; // Foco/Estratégia
  agi: number; // Resiliência/Esquiva
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  collection: 'core' | 'call_of_the_night';
  icon: string; // Emoji or simple visual rep
  stats: CardStats;
}

export interface UserState {
  xp: number;
  level: number;
  name: string;
  credits: number; // Currency for Gacha (100 = 1 pull)
  inventory: string[]; // IDs of collected items
  lastBackupDate: string | null;
}

export type Tab = 'habits' | 'dashboard' | 'journal' | 'profile';