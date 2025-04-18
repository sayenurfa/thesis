const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bus',
  port: 3306
});

// 1. Tüm otobüs rotalarını getir
app.get('/api/routes', (req, res) => {
  db.query('SELECT * FROM routes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 2. Belirli bir rotaya ait tüm saatleri getir
app.get('/api/schedules/:routeId', (req, res) => {
  const routeId = req.params.routeId;
  db.query('SELECT * FROM bus_schedules WHERE route_id = ?', [routeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 3. Yeni otobüs ekle
app.post('/api/buses', (req, res) => {
  const { route_number, from_location, to_location, frequency_minutes } = req.body;
  db.query(
    'INSERT INTO routes (route_number, from_location, to_location, frequency_minutes) VALUES (?, ?, ?, ?)',
    [route_number, from_location, to_location, frequency_minutes],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Bus added', id: result.insertId });
    }
  );
});

// 4. Seçili saatleri sil
app.post('/api/schedules/delete', (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }
  db.query('DELETE FROM bus_schedules WHERE id IN (?)', [ids], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Deleted', affected: result.affectedRows });
  });
});

// 5. Rota sil (ve ona bağlı tüm saatleri de)
app.delete('/api/routes/:routeId', (req, res) => {
  const routeId = req.params.routeId;

  db.query('DELETE FROM bus_schedules WHERE route_id = ?', [routeId], (err) => {
    if (err) return res.status(500).json({ error: err });

    db.query('DELETE FROM routes WHERE id = ?', [routeId], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Route and associated schedules deleted' });
    });
  });
});

// Yeni saat (schedule) ekleme
app.post('/api/schedules', (req, res) => {
  const { route_id, departure_time, arrival_time, status } = req.body;

  if (!route_id || !departure_time || !arrival_time || !status) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const sql = `
    INSERT INTO bus_schedules (route_id, departure_time, arrival_time, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [route_id, departure_time, arrival_time, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Schedule added', id: result.insertId });
  });
});


app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});


// Belirli bir rotaya ait durakları getir
app.get('/api/stops/:routeId', (req, res) => {
  const routeId = req.params.routeId;

  db.query(
    'SELECT * FROM stops WHERE route_id = ? ORDER BY stop_order ASC',
    [routeId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});



// Announcements - Fetch all
app.get('/api/announcements', (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// Announcements - Add new
app.post('/api/announcements', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  db.query(
    'INSERT INTO announcements (title, content) VALUES (?, ?)',
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Announcement added successfully', id: result.insertId });
    }
  );
});



app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = results[0];

    if (results[0].password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    
    res.json({ success: true, username: results[0].username });
  });
});
