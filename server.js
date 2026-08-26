const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'src', 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// functions helps to read/write database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { lists: [], items: [] };
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

// Bulk sync endpoint - replaces entire database with client data
app.post('/sync', (req, res) => {
  try {
    const { lists, items } = req.body;
    const db = readDatabase();
    
    if (lists !== undefined) {
      db.lists = lists;
    }
    if (items !== undefined) {
      db.items = items;
    }
    
    writeDatabase(db);
    res.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Get all data endpoint
app.get('/data', (req, res) => {
  const db = readDatabase();
  res.json(db);
});

// Lists endpoints
app.get('/lists', (req, res) => {
  const db = readDatabase();
  res.json(db.lists);
});

app.post('/lists', (req, res) => {
  const db = readDatabase();
  const newList = {
    id: Date.now(),
    name: req.body.name,
    itemCount: req.body.itemCount || 0,
    createdAt: Date.now(),
  };
  db.lists.push(newList);
  writeDatabase(db);
  res.json(newList);
});

app.patch('/lists/:id', (req, res) => {
  const db = readDatabase();
  const index = db.lists.findIndex(list => list.id === parseInt(req.params.id));
  if (index !== -1) {
    db.lists[index] = { ...db.lists[index], ...req.body };
    writeDatabase(db);
    res.json(db.lists[index]);
  } else {
    res.status(404).json({ error: 'List not found' });
  }
});

app.delete('/lists/:id', (req, res) => {
  const db = readDatabase();
  const listId = parseInt(req.params.id);
  
  // Remove the list
  db.lists = db.lists.filter(list => list.id !== listId);
  
  // Remove all items associated with this list
  db.items = db.items.filter(item => item.listId !== listId);
  
  writeDatabase(db);
  res.json({ success: true });
});

// Items endpoints
app.get('/items', (req, res) => {
  const db = readDatabase();
  res.json(db.items);
});

app.post('/items', (req, res) => {
  const db = readDatabase();
  const newItem = {
    id: Date.now(),
    ...req.body,
    createdAt: Date.now(),
  };
  db.items.push(newItem);
  writeDatabase(db);
  res.json(newItem);
});

app.patch('/items/:id', (req, res) => {
  const db = readDatabase();
  const index = db.items.findIndex(item => item.id === parseInt(req.params.id));
  if (index !== -1) {
    db.items[index] = { ...db.items[index], ...req.body };
    writeDatabase(db);
    res.json(db.items[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/items/:id', (req, res) => {
  const db = readDatabase();
  const itemId = parseInt(req.params.id);
  const item = db.items.find(item => item.id === itemId);
  
  if (item) {
    
    // Decrement item count in the associated list
    const listIndex = db.lists.findIndex(list => list.id === item.listId);
    if (listIndex !== -1 && db.lists[listIndex].itemCount > 0) {
      db.lists[listIndex].itemCount -= 1;
    }
    
    // Remove the item
    db.items = db.items.filter(item => item.id !== itemId);
    writeDatabase(db);
  }
  
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database path: ${DB_PATH}`);
});
