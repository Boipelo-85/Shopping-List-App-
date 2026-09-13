import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Read / write helpers
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { lists: [], items: [], users: [] };
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

// Auth helper — reads x-user-id header, returns parsed int or sends 401 and returns null
const requireUserId = (req, res) => {
  const raw = req.headers['x-user-id'];
  const userId = parseInt(raw);
  if (!raw || isNaN(userId)) {
    res.status(401).json({ message: 'x-user-id header is required' });
    return null;
  }
  return userId;
};

// ── Bulk / debug endpoints ────────────────────────────────────────────────────

app.get('/data', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

app.post('/sync', (req, res) => {
  try {
    const { lists, items } = req.body;
    const db = readDatabase();
    if (lists !== undefined) db.lists = lists;
    if (items !== undefined) db.items = items;
    writeDatabase(db);
    res.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// ── Users (no auth required — needed for login / register) ───────────────────

app.get('/users', (req, res) => {
  const db = readDatabase();
  res.json(db.users || []);
});

app.post('/users', (req, res) => {
  const db = readDatabase();
  if (!db.users) db.users = [];
  const newUser = {
    id: Date.now(),
    ...req.body,
    createdAt: Date.now(),
  };
  db.users.push(newUser);
  writeDatabase(db);
  res.json(newUser);
});

app.get('/users/:id', (req, res) => {
  const db = readDatabase();
  const user = (db.users || []).find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ── Lists ─────────────────────────────────────────────────────────────────────

app.get('/lists', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  const userLists = db.lists.filter(list => list.userId === userId);
  res.json(userLists);
});

app.post('/lists', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const { userId: _removed, ...rest } = req.body;
  const db = readDatabase();
  const newList = {
    id: Date.now(),
    name: rest.name,
    itemCount: rest.itemCount || 0,
    userId,
    createdAt: Date.now(),
  };
  db.lists.push(newList);
  writeDatabase(db);
  res.json(newList);
});

app.patch('/lists/:id', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  const listId = parseInt(req.params.id);
  const index = db.lists.findIndex(list => list.id === listId);

  if (index === -1) return res.status(404).json({ error: 'List not found' });
  if (db.lists[index].userId !== userId) return res.status(403).json({ message: 'Forbidden' });

  const { userId: _removed, ...rest } = req.body;
  db.lists[index] = { ...db.lists[index], ...rest };
  writeDatabase(db);
  res.json(db.lists[index]);
});

app.delete('/lists/:id', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  const listId = parseInt(req.params.id);
  const list = db.lists.find(l => l.id === listId);

  if (!list) return res.status(404).json({ error: 'List not found' });
  if (list.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

  db.lists = db.lists.filter(l => l.id !== listId);
  db.items = db.items.filter(item => item.listId !== listId);
  writeDatabase(db);
  res.json({ success: true });
});

// ── Items ─────────────────────────────────────────────────────────────────────

app.get('/items', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  let items = db.items.filter(item => item.userId === userId);

  if (req.query.listId !== undefined) {
    const listId = parseInt(req.query.listId);
    items = items.filter(item => item.listId === listId);
  }

  res.json(items);
});

app.post('/items', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const { userId: _removed, ...rest } = req.body;
  const db = readDatabase();
  const newItem = {
    id: Date.now(),
    ...rest,
    userId,
    createdAt: Date.now(),
  };
  db.items.push(newItem);
  writeDatabase(db);
  res.json(newItem);
});

app.patch('/items/:id', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  const itemId = parseInt(req.params.id);
  const index = db.items.findIndex(item => item.id === itemId);

  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  if (db.items[index].userId !== userId) return res.status(403).json({ message: 'Forbidden' });

  const { userId: _removed, ...rest } = req.body;
  db.items[index] = { ...db.items[index], ...rest };
  writeDatabase(db);
  res.json(db.items[index]);
});

app.delete('/items/:id', (req, res) => {
  const userId = requireUserId(req, res);
  if (userId === null) return;

  const db = readDatabase();
  const itemId = parseInt(req.params.id);
  const item = db.items.find(i => i.id === itemId);

  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.userId !== userId) return res.status(403).json({ message: 'Forbidden' });

  // Decrement itemCount on the associated list
  const listIndex = db.lists.findIndex(list => list.id === item.listId);
  if (listIndex !== -1 && db.lists[listIndex].itemCount > 0) {
    db.lists[listIndex].itemCount -= 1;
  }

  db.items = db.items.filter(i => i.id !== itemId);
  writeDatabase(db);
  res.json({ success: true });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database path: ${DB_PATH}`);
});
