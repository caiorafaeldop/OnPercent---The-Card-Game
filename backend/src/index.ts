import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { initializeDatabase, isDatabaseMode } from './db.js';
import { 
  getHabits, 
  saveHabits, 
  getJournal, 
  saveJournal, 
  getUser, 
  saveUser,
  getDcc,
  saveDcc,
  Habit,
  JournalEntry,
  UserState
} from './persistence.js';


const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600
}));

// API Routes
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    databaseMode: isDatabaseMode,
    timestamp: new Date().toISOString()
  });
});

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

app.get('/api/dcc', async (c) => {
  try {
    const dcc = await getDcc();
    return c.json(dcc);
  } catch (err) {
    console.error('Error fetching dcc:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.post('/api/dcc', async (c) => {
  try {
    const body = await c.req.json<Record<string, any>>();
    await saveDcc(body);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error saving dcc:', err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});


// Serve Static Frontend (Monolith Mode)
app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/assets/*', serveStatic({ root: '../dist' }));
app.use('/favicon.ico', serveStatic({ root: './dist' }));
app.use('/favicon.ico', serveStatic({ root: '../dist' }));
app.use('/*', serveStatic({ root: './dist' }));
app.use('/*', serveStatic({ root: '../dist' }));

// SPA Fallback for non-API routes
app.get('*', serveStatic({ root: './dist', path: 'index.html' }));
app.get('*', serveStatic({ root: '../dist', path: 'index.html' }));

const port = Number(process.env.PORT) || 3001;

// Init DB and Start Server
initializeDatabase().then(() => {
  console.log(`Starting Monolithic Server on port ${port}...`);
  serve({
    fetch: app.fetch,
    port: port
  });
});

