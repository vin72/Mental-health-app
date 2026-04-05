const express = require('express');
const db = require('../database');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Create mood entry
router.post('/', (req, res) => {
  const { mood, note } = req.body;

  if (!mood || mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'Mood must be between 1 and 5' });
  }

  const result = db.prepare(
    'INSERT INTO mood_entries (user_id, mood, note) VALUES (?, ?, ?)'
  ).run(req.userId, mood, note || null);

  const entry = db.prepare('SELECT * FROM mood_entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(entry);
});

// Get all mood entries for the user
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  const entries = db.prepare(
    'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(req.userId, limit);
  res.json(entries);
});

// Get mood stats
router.get('/stats', (req, res) => {
  const days = parseInt(req.query.days) || 7;

  const stats = db.prepare(`
    SELECT
      DATE(created_at) as date,
      ROUND(AVG(mood), 1) as avg_mood,
      COUNT(*) as entries
    FROM mood_entries
    WHERE user_id = ? AND created_at >= datetime('now', ?)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all(req.userId, `-${days} days`);

  const overall = db.prepare(`
    SELECT ROUND(AVG(mood), 1) as avg_mood, COUNT(*) as total
    FROM mood_entries
    WHERE user_id = ? AND created_at >= datetime('now', ?)
  `).get(req.userId, `-${days} days`);

  res.json({ daily: stats, overall });
});

// Delete mood entry
router.delete('/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM mood_entries WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json({ message: 'Entry deleted' });
});

module.exports = router;
