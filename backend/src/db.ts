import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
export let pool: pg.Pool | null = null;
export let isDatabaseMode = false;

if (databaseUrl && databaseUrl.trim()) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false // Neon DB requires SSL
      }
    });
    isDatabaseMode = true;
    console.log('Database Mode configured: Neon DB client initialized.');
  } catch (err) {
    console.error('Failed to initialize database pool:', err);
    pool = null;
    isDatabaseMode = false;
  }
} else {
  console.log('Local Mode: No DATABASE_URL provided. Using JSON file persistence.');
}

export async function initializeDatabase() {
  if (!pool || !isDatabaseMode) return;

  try {
    const client = await pool.connect();
    try {
      // 1. User Profile Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_profile (
          id VARCHAR(50) PRIMARY KEY,
          xp INTEGER NOT NULL DEFAULT 0,
          level INTEGER NOT NULL DEFAULT 1,
          name VARCHAR(100) NOT NULL,
          credits INTEGER NOT NULL DEFAULT 100,
          inventory JSONB NOT NULL DEFAULT '[]'::jsonb,
          last_backup_date VARCHAR(50),
          meals_today INTEGER NOT NULL DEFAULT 0,
          last_meal_date VARCHAR(50),
          meal_history JSONB NOT NULL DEFAULT '{}'::jsonb
        );
      `);

      // 2. Habits Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS habits (
          id VARCHAR(50) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          difficulty VARCHAR(20) NOT NULL,
          created_at VARCHAR(50) NOT NULL,
          completed_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
          owner VARCHAR(20) DEFAULT 'caio'
        );
      `);

      // Ensure owner column exists if table was created previously
      await client.query(`
        ALTER TABLE habits ADD COLUMN IF NOT EXISTS owner VARCHAR(20) DEFAULT 'caio';
      `);

      // 3. Journal Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS journal (
          id VARCHAR(50) PRIMARY KEY,
          date VARCHAR(50) NOT NULL,
          content TEXT NOT NULL,
          rating INTEGER NOT NULL
        );
      `);

      // 4. DCC Completions Table (legacy support)
      await client.query(`
        CREATE TABLE IF NOT EXISTS dcc_completions (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL DEFAULT '{}'::jsonb
        );
      `);

      // 5. Devotionals Table (Fé)
      await client.query(`
        CREATE TABLE IF NOT EXISTS devotionals (
          id VARCHAR(50) PRIMARY KEY,
          theme VARCHAR(255) NOT NULL,
          verse_reference VARCHAR(100) NOT NULL,
          verse_text TEXT NOT NULL,
          reflection_prompt TEXT,
          completed_by_caio BOOLEAN NOT NULL DEFAULT FALSE,
          completed_by_analaura BOOLEAN NOT NULL DEFAULT FALSE,
          caio_note TEXT,
          analaura_note TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      console.log('Database schemas successfully initialized / verified.');
    } finally {
      client.release();
    }


  } catch (err) {
    console.error('Database connection failed. Reverting to Local Mode.', err);
    isDatabaseMode = false;
    pool = null;
  }
}
