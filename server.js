import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
// In production on Render, use the persistent disk at /data.
// Locally, use database.json in the project root.
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/data/database.json'
  : path.join(__dirname, 'database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'shopping-list-secret-key-2024';
const SALT_ROUNDS = 10;
const DIST_PATH = path.join(__dirname, 'dist');

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// ── DB helpers ────────────────────────────────────────────────────────────────

const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], lists: [], items: [] };
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

// ── Auth middleware ───────────────────────────────────────────────────────────

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = parseInt(decoded.userId);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ── Auth routes ───────────────────────────────────────────────────────────────

app.post('/auth/register', async (req, res) => {
  const { firstName, lastName, email, celphone, password } = req.body;

  if (!firstName || !lastName || !email || !celphone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const db = readDatabase();
  if (!db.users) db.users = [];

  const existing = db.users.find(
    (u) => u.email === email.toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = {
    id: Date.now(),
    username: email.toLowerCase(),
    firstName,
    lastName,
    email: email.toLowerCase(),
    celphone,
    password: hashedPassword,
    createdAt: Date.now(),
  };

  db.users.push(newUser);
  writeDatabase(db);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = readDatabase();
  const user = (db.users || []).find(
    (u) => u.email === email.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/auth/me', authenticateToken, (req, res) => {
  const db = readDatabase();
  const user = (db.users || []).find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.patch('/auth/me/credentials', authenticateToken, async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const db = readDatabase();
  const index = (db.users || []).findIndex((u) => u.id === req.userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  const user = db.users[index];
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  if (email && email.toLowerCase() !== user.email) {
    const taken = db.users.find(
      (u) => u.email === email.toLowerCase() && u.id !== req.userId
    );
    if (taken) return res.status(409).json({ message: 'Email already in use' });
    db.users[index].email = email.toLowerCase();
    db.users[index].username = email.toLowerCase();
  }

  if (newPassword) {
    db.users[index].password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  }

  writeDatabase(db);
  const { password: _, ...safeUser } = db.users[index];
  res.json(safeUser);
});

app.patch('/auth/me/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, celphone } = req.body;

  const db = readDatabase();
  const index = (db.users || []).findIndex((u) => u.id === req.userId);
  if (index === -1) return res.status(404).json({ message: 'User not found' });

  if (firstName !== undefined) db.users[index].firstName = firstName;
  if (lastName !== undefined) db.users[index].lastName = lastName;
  if (celphone !== undefined) db.users[index].celphone = celphone;

  writeDatabase(db);
  const { password: _, ...safeUser } = db.users[index];
  res.json(safeUser);
});

// ── Users (protected, backward compat) ───────────────────────────────────────

app.get('/users', authenticateToken, (req, res) => {
  const db = readDatabase();
  const safeUsers = (db.users || []).map(({ password: _, ...u }) => u);
  res.json(safeUsers);
});

app.get('/users/:id', authenticateToken, (req, res) => {
  const db = readDatabase();
  const user = (db.users || []).find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// ── Public shared list ────────────────────────────────────────────────────────

app.get('/shared/list/:id', (req, res) => {
  const db = readDatabase();
  const listId = parseInt(req.params.id);
  const list = db.lists.find((l) => l.id === listId);

  if (!list) return res.status(404).json({ message: 'List not found' });

  const items = db.items.filter((item) => item.listId === listId);
  res.json({ list, items });
});

// ── Lists ─────────────────────────────────────────────────────────────────────

app.get('/lists', authenticateToken, (req, res) => {
  const db = readDatabase();
  const userLists = db.lists.filter((list) => list.userId === req.userId);
  res.json(userLists);
});

app.post('/lists', authenticateToken, (req, res) => {
  const { userId: _removed, ...rest } = req.body;
  const db = readDatabase();
  const newList = {
    id: Date.now(),
    name: rest.name,
    itemCount: rest.itemCount || 0,
    userId: req.userId,
    createdAt: Date.now(),
  };
  db.lists.push(newList);
  writeDatabase(db);
  res.json(newList);
});

app.patch('/lists/:id', authenticateToken, (req, res) => {
  const db = readDatabase();
  const listId = parseInt(req.params.id);
  const index = db.lists.findIndex((list) => list.id === listId);

  if (index === -1) return res.status(404).json({ error: 'List not found' });
  if (db.lists[index].userId !== req.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { userId: _removed, ...rest } = req.body;
  db.lists[index] = { ...db.lists[index], ...rest };
  writeDatabase(db);
  res.json(db.lists[index]);
});

app.delete('/lists/:id', authenticateToken, (req, res) => {
  const db = readDatabase();
  const listId = parseInt(req.params.id);
  const list = db.lists.find((l) => l.id === listId);

  if (!list) return res.status(404).json({ error: 'List not found' });
  if (list.userId !== req.userId) return res.status(403).json({ message: 'Forbidden' });

  db.lists = db.lists.filter((l) => l.id !== listId);
  db.items = db.items.filter((item) => item.listId !== listId);
  writeDatabase(db);
  res.json({ success: true });
});

// ── Items ─────────────────────────────────────────────────────────────────────

app.get('/items', authenticateToken, (req, res) => {
  const db = readDatabase();
  let items = db.items.filter((item) => item.userId === req.userId);

  if (req.query.listId !== undefined) {
    const listId = parseInt(req.query.listId);
    items = items.filter((item) => item.listId === listId);
  }

  res.json(items);
});

app.post('/items', authenticateToken, (req, res) => {
  const { userId: _removed, ...rest } = req.body;
  const db = readDatabase();
  const newItem = {
    id: Date.now(),
    ...rest,
    userId: req.userId,
    createdAt: Date.now(),
  };
  db.items.push(newItem);
  writeDatabase(db);
  res.json(newItem);
});

app.patch('/items/:id', authenticateToken, (req, res) => {
  const db = readDatabase();
  const itemId = parseInt(req.params.id);
  const index = db.items.findIndex((item) => item.id === itemId);

  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  if (db.items[index].userId !== req.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { userId: _removed, ...rest } = req.body;
  db.items[index] = { ...db.items[index], ...rest };
  writeDatabase(db);
  res.json(db.items[index]);
});

app.delete('/items/:id', authenticateToken, (req, res) => {
  const db = readDatabase();
  const itemId = parseInt(req.params.id);
  const item = db.items.find((i) => i.id === itemId);

  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.userId !== req.userId) return res.status(403).json({ message: 'Forbidden' });

  const listIndex = db.lists.findIndex((list) => list.id === item.listId);
  if (listIndex !== -1 && db.lists[listIndex].itemCount > 0) {
    db.lists[listIndex].itemCount -= 1;
  }

  db.items = db.items.filter((i) => i.id !== itemId);
  writeDatabase(db);
  res.json({ success: true });
});

// ── Serve React frontend (production build) ──────────────────────────────────

if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));

  // SPA fallback — any route not matched by the API returns index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database path: ${DB_PATH}`);
  console.log(`Serving frontend: ${fs.existsSync(DIST_PATH) ? DIST_PATH : 'not built yet'}`);
});
