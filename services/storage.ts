import { Habit, JournalEntry, UserState, DccCompletionsState } from '../types';

const KEYS = {
  HABITS: 'onpercent_habits',
  JOURNAL: 'onpercent_journal',
  USER: 'onpercent_user',
  THEME: 'onpercent_theme',
  DCC: 'onpercent_dcc'
};

const API_BASE = '/api';

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

// --- Async API layer (primary) with localStorage fallback ---

export const loadHabits = async (): Promise<Habit[]> => {
  try {
    const res = await fetch(`${API_BASE}/habits`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(KEYS.HABITS, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend unreachable for habits, using local cache:', err);
  }
  return safeJsonParse<Habit[]>(localStorage.getItem(KEYS.HABITS), []);
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  try {
    await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habits)
    });
  } catch (err) {
    console.warn('Backend unreachable for saving habits:', err);
  }
};

export const loadJournal = async (): Promise<JournalEntry[]> => {
  try {
    const res = await fetch(`${API_BASE}/journal`);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(KEYS.JOURNAL, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Backend unreachable for journal, using local cache:', err);
  }
  return safeJsonParse<JournalEntry[]>(localStorage.getItem(KEYS.JOURNAL), []);
};

export const saveJournal = async (entries: JournalEntry[]): Promise<void> => {
  localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
  try {
    await fetch(`${API_BASE}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });
  } catch (err) {
    console.warn('Backend unreachable for saving journal:', err);
  }
};

export const loadUser = async (): Promise<UserState> => {
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

  try {
    const res = await fetch(`${API_BASE}/user`);
    if (res.ok) {
      const data = await res.json();
      const merged = { ...defaultUser, ...data };
      localStorage.setItem(KEYS.USER, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Backend unreachable for user, using local cache:', err);
  }

  const parsed = safeJsonParse<Partial<UserState>>(localStorage.getItem(KEYS.USER), {});
  return { ...defaultUser, ...parsed };
};

export const saveUser = async (user: UserState): Promise<void> => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  try {
    await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  } catch (err) {
    console.warn('Backend unreachable for saving user:', err);
  }
};

// --- Sync-only (theme and DCC stay in localStorage, no backend needed) ---

export const loadTheme = (): boolean => {
  return localStorage.getItem(KEYS.THEME) === 'dark';
};

export const saveTheme = (isDark: boolean) => {
  localStorage.setItem(KEYS.THEME, isDark ? 'dark' : 'light');
};

export const loadDccCompletions = (): DccCompletionsState => {
  return safeJsonParse<DccCompletionsState>(localStorage.getItem(KEYS.DCC), {});
};

export const saveDccCompletions = (completions: DccCompletionsState) => {
  localStorage.setItem(KEYS.DCC, JSON.stringify(completions));
};

// Backup Utilities (use local cache for instant export)
export const exportData = (): string => {
  const data = {
    user: safeJsonParse<UserState>(localStorage.getItem(KEYS.USER), {} as UserState),
    habits: safeJsonParse<Habit[]>(localStorage.getItem(KEYS.HABITS), []),
    journal: safeJsonParse<JournalEntry[]>(localStorage.getItem(KEYS.JOURNAL), []),
    dcc: safeJsonParse<DccCompletionsState>(localStorage.getItem(KEYS.DCC), {}),
    theme: loadTheme(),
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

export const importData = async (json: string): Promise<boolean> => {
  try {
    const data = JSON.parse(json);
    if (data.user) await saveUser(data.user);
    if (data.habits) await saveHabits(data.habits);
    if (data.journal) await saveJournal(data.journal);
    if (data.dcc) saveDccCompletions(data.dcc);
    if (data.theme !== undefined) saveTheme(data.theme);
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
};
