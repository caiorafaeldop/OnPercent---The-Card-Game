import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, isDatabaseMode } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Types
export interface Habit {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  completedDates: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  rating: number;
}

export interface UserState {
  xp: number;
  level: number;
  name: string;
  credits: number;
  inventory: string[];
  lastBackupDate: string | null;
  mealsToday: number;
  lastMealDate: string | null;
  mealHistory?: Record<string, number>;
}

// Helpers
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if already exists
  }
}

async function readLocalFile<T>(filename: string, fallback: T): Promise<T> {
  const filepath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeLocalFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filepath = path.join(DATA_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// Habits Persistence
export async function getHabits(): Promise<Habit[]> {
  if (isDatabaseMode && pool) {
    try {
      const res = await pool.query('SELECT * FROM habits');
      return res.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        difficulty: row.difficulty,
        createdAt: row.created_at,
        completedDates: typeof row.completed_dates === 'string' 
          ? JSON.parse(row.completed_dates) 
          : row.completed_dates || []
      }));
    } catch (err) {
      console.error('Failed to load habits from DB, using local fallback:', err);
    }
  }
  return readLocalFile<Habit[]>('habits.json', []);
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  if (isDatabaseMode && pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM habits');
      for (const h of habits) {
        await client.query(
          'INSERT INTO habits (id, title, difficulty, created_at, completed_dates) VALUES ($1, $2, $3, $4, $5)',
          [h.id, h.title, h.difficulty, h.createdAt, JSON.stringify(h.completedDates)]
        );
      }
      await client.query('COMMIT');
      return;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to save habits to DB, using local fallback:', err);
    } finally {
      client.release();
    }
  }
  await writeLocalFile<Habit[]>('habits.json', habits);
}

// Journal Persistence
export async function getJournal(): Promise<JournalEntry[]> {
  if (isDatabaseMode && pool) {
    try {
      const res = await pool.query('SELECT * FROM journal');
      return res.rows.map((row: any) => ({
        id: row.id,
        date: row.date,
        content: row.content,
        rating: row.rating
      }));

    } catch (err) {
      console.error('Failed to load journal from DB, using local fallback:', err);
    }
  }
  return readLocalFile<JournalEntry[]>('journal.json', []);
}

export async function saveJournal(entries: JournalEntry[]): Promise<void> {
  if (isDatabaseMode && pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM journal');
      for (const j of entries) {
        await client.query(
          'INSERT INTO journal (id, date, content, rating) VALUES ($1, $2, $3, $4)',
          [j.id, j.date, j.content, j.rating]
        );
      }
      await client.query('COMMIT');
      return;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to save journal to DB, using local fallback:', err);
    } finally {
      client.release();
    }
  }
  await writeLocalFile<JournalEntry[]>('journal.json', entries);
}

// User Profile Persistence
export async function getUser(): Promise<UserState> {
  const defaultUser: UserState = {
    xp: 0,
    level: 1,
    name: 'Aspiring 1%',
    credits: 100,
    inventory: [],
    lastBackupDate: null,
    mealsToday: 0,
    lastMealDate: null,
    mealHistory: {}
  };

  if (isDatabaseMode && pool) {
    try {
      const res = await pool.query('SELECT * FROM user_profile WHERE id = $1', ['default']);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          xp: row.xp,
          level: row.level,
          name: row.name,
          credits: row.credits,
          inventory: typeof row.inventory === 'string' ? JSON.parse(row.inventory) : row.inventory || [],
          lastBackupDate: row.last_backup_date,
          mealsToday: row.meals_today,
          lastMealDate: row.last_meal_date,
          mealHistory: typeof row.meal_history === 'string' ? JSON.parse(row.meal_history) : row.meal_history || {}
        };
      }
    } catch (err) {
      console.error('Failed to load user from DB, using local fallback:', err);
    }
  }
  return readLocalFile<UserState>('user.json', defaultUser);
}

export async function saveUser(user: UserState): Promise<void> {
  if (isDatabaseMode && pool) {
    try {
      await pool.query(
        `INSERT INTO user_profile (id, xp, level, name, credits, inventory, last_backup_date, meals_today, last_meal_date, meal_history)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
         xp = EXCLUDED.xp,
         level = EXCLUDED.level,
         name = EXCLUDED.name,
         credits = EXCLUDED.credits,
         inventory = EXCLUDED.inventory,
         last_backup_date = EXCLUDED.last_backup_date,
         meals_today = EXCLUDED.meals_today,
         last_meal_date = EXCLUDED.last_meal_date,
         meal_history = EXCLUDED.meal_history`,
        [
          'default',
          user.xp,
          user.level,
          user.name,
          user.credits,
          JSON.stringify(user.inventory),
          user.lastBackupDate,
          user.mealsToday,
          user.lastMealDate,
          JSON.stringify(user.mealHistory || {})
        ]
      );
      return;
    } catch (err) {
      console.error('Failed to save user to DB, using local fallback:', err);
    }
  }
  await writeLocalFile<UserState>('user.json', user);
}

// DCC Completions Persistence
export async function getDcc(): Promise<Record<string, any>> {
  if (isDatabaseMode && pool) {
    try {
      const res = await pool.query('SELECT data FROM dcc_completions WHERE id = $1', ['default']);
      if (res.rows.length > 0) {
        const data = res.rows[0].data;
        return typeof data === 'string' ? JSON.parse(data) : data || {};
      }
    } catch (err) {
      console.error('Failed to load DCC from DB, using local fallback:', err);
    }
  }
  return readLocalFile<Record<string, any>>('dcc.json', {});
}

export async function saveDcc(completions: Record<string, any>): Promise<void> {
  if (isDatabaseMode && pool) {
    try {
      await pool.query(
        `INSERT INTO dcc_completions (id, data)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        ['default', JSON.stringify(completions)]
      );
      return;
    } catch (err) {
      console.error('Failed to save DCC to DB, using local fallback:', err);
    }
  }
  await writeLocalFile<Record<string, any>>('dcc.json', completions);
}

