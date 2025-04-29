const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./optouts.db');

// ✅ Enable CORS for requests from your HTML frontend
app.use(cors());

// ✅ Allow JSON body parsing
app.use(express.json());

// ✅ Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS optouts (
  number TEXT PRIMARY KEY
)`);

// ✅ Get all opt-out numbers
app.get('/optouts', (req, res) => {
  db.all('SELECT number FROM optouts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => row.number));
  });
});

// ✅ Add a number to the opt-out list
app.post('/optouts', (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: 'Missing number' });
  db.run('INSERT OR IGNORE INTO optouts (number) VALUES (?)', [number], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// ✅ Remove a number from the opt-out list
app.delete('/optouts/:number', (req, res) => {
  db.run('DELETE FROM optouts WHERE number = ?', [req.params.number], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});

