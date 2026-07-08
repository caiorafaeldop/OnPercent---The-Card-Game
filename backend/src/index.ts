import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { initializeDatabase } from './db.js';
import { 
  getHabits, 
  saveHabits, 
  getJournal, 
  saveJournal, 
  getUser, 
  saveUser,
  Habit,
  JournalEntry,
  UserState
} from './persistence.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*', // We can restrict this or allow wildcard for easy frontend local connections
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600
}));

// Route mappings
app.get('/api/habits', async (c) => {
  try {
    const habits = await getHabits();
    return c.json(habits);
  } catch (err) {
    console.error('Error fetching habits:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.post('/api/habits', async (c) => {
  try {
    const body = await c.req.json<Habit[]>();
    await saveHabits(body);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error saving habits:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.get('/api/journal', async (c) => {
  try {
    const entries = await getJournal();
    return c.json(entries);
  } catch (err) {
    console.error('Error fetching journal:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.post('/api/journal', async (c) => {
  try {
    const body = await c.req.json<JournalEntry[]>();
    await saveJournal(body);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error saving journal:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.get('/api/user', async (c) => {
  try {
    const user = await getUser();
    return c.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.post('/api/user', async (c) => {
  try {
    const body = await c.req.json<UserState>();
    await saveUser(body);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error saving user:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Root check
app.get('/', (c) => c.text('1 porcento API is running!'));

const port = Number(process.env.PORT) || 3001;

// Init DB and Start Server
initializeDatabase().then(() => {
  console.log(`Starting server on port ${port}...`);
  serve({
    fetch: app.fetch,
    port: port
  });
});
