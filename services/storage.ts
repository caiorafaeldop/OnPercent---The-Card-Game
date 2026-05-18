import { Collectible, EvolutionState, Habit, JournalEntry, UserState } from '../types';
import { normalizeEvolutionState } from './evolution';

const KEYS = {
  HABITS: 'onpercent_habits',
  JOURNAL: 'onpercent_journal',
  USER: 'onpercent_user',
  THEME: 'onpercent_theme',
  CUSTOM_CARDS: 'onpercent_custom_cards',
  EVOLUTION: 'onpercent_evolution',
  GROQ_KEY: 'onpercent_groq_key'
};

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const loadHabits = (): Habit[] => {
  return safeJsonParse<Habit[]>(localStorage.getItem(KEYS.HABITS), []);
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
};

export const loadJournal = (): JournalEntry[] => {
  return safeJsonParse<JournalEntry[]>(localStorage.getItem(KEYS.JOURNAL), []);
};

export const saveJournal = (entries: JournalEntry[]) => {
  localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
};

export const loadUser = (): UserState => {
  const defaultUser: UserState = {
    xp: 0,
    level: 1,
    name: 'Aspiring 1%',
    credits: 100,
    inventory: [],
    lastBackupDate: null,
    mealsToday: 0,
    lastMealDate: null
  };

  const parsed = safeJsonParse<Partial<UserState>>(localStorage.getItem(KEYS.USER), {});
  return { ...defaultUser, ...parsed };
};

export const saveUser = (user: UserState) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const loadCustomCards = (): Collectible[] => {
  const cards = safeJsonParse<Collectible[]>(localStorage.getItem(KEYS.CUSTOM_CARDS), []);
  return cards.filter(card => card && card.id && card.name);
};

export const saveCustomCards = (cards: Collectible[]) => {
  localStorage.setItem(KEYS.CUSTOM_CARDS, JSON.stringify(cards));
};

export const loadEvolution = (): EvolutionState => {
  const parsed = safeJsonParse<Partial<EvolutionState>>(localStorage.getItem(KEYS.EVOLUTION), {});
  return normalizeEvolutionState(parsed);
};

export const saveEvolution = (state: EvolutionState) => {
  localStorage.setItem(KEYS.EVOLUTION, JSON.stringify(normalizeEvolutionState(state)));
};

export const loadGroqKey = (): string => {
  return localStorage.getItem(KEYS.GROQ_KEY) || '';
};

export const saveGroqKey = (key: string) => {
  if (key.trim()) {
    localStorage.setItem(KEYS.GROQ_KEY, key.trim());
  } else {
    localStorage.removeItem(KEYS.GROQ_KEY);
  }
};

export const loadTheme = (): boolean => {
  return localStorage.getItem(KEYS.THEME) === 'dark';
};

export const saveTheme = (isDark: boolean) => {
  localStorage.setItem(KEYS.THEME, isDark ? 'dark' : 'light');
};

// Backup Utilities
export const exportData = (): string => {
  const data = {
    user: loadUser(),
    habits: loadHabits(),
    journal: loadJournal(),
    customCards: loadCustomCards(),
    evolution: loadEvolution(),
    theme: loadTheme(),
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (data.user) saveUser(data.user);
    if (data.habits) saveHabits(data.habits);
    if (data.journal) saveJournal(data.journal);
    if (data.customCards) saveCustomCards(data.customCards);
    if (data.evolution) saveEvolution(data.evolution);
    if (data.theme !== undefined) saveTheme(data.theme);
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
};
