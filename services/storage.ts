import { Habit, JournalEntry, UserState } from '../types';

const KEYS = {
  HABITS: 'onpercent_habits',
  JOURNAL: 'onpercent_journal',
  USER: 'onpercent_user',
  THEME: 'onpercent_theme'
};

export const loadHabits = (): Habit[] => {
  const data = localStorage.getItem(KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
};

export const loadJournal = (): JournalEntry[] => {
  const data = localStorage.getItem(KEYS.JOURNAL);
  return data ? JSON.parse(data) : [];
};

export const saveJournal = (entries: JournalEntry[]) => {
  localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
};

export const loadUser = (): UserState => {
  const data = localStorage.getItem(KEYS.USER);
  // Migration for old users or default
  const defaultUser: UserState = { 
    xp: 0, 
    level: 1, 
    name: 'Aspiring 1%', 
    credits: 100, // Start with 1 free pull
    inventory: [],
    lastBackupDate: null,
    mealsToday: 0,
    lastMealDate: null
  };
  
  if (!data) return defaultUser;
  
  const parsed = JSON.parse(data);
  return { ...defaultUser, ...parsed };
};

export const saveUser = (user: UserState) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
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
    if (data.theme !== undefined) saveTheme(data.theme);
    return true;
  } catch (e) {
    console.error("Failed to import data", e);
    return false;
  }
};