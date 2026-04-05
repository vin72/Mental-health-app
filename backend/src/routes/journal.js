const express = require('express');
const db = require('../database');
const authenticate = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Create journal entry
router.post('/', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const result = db.prepare(
    'INSERT INTO journal_entries (user_id, title, content) VALUES (?, ?, ?)'
  ).run(req.userId, title, content);

  const entry = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(entry);
});

// Get all journal entries
router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;

  const entries = db.prepare(
    'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(req.userId, limit, offset);

  const total = db.prepare(
    'SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ?'
  ).get(req.userId);

  res.json({ entries, total: total.count });
});

// Get single journal entry
router.get('/:id', (req, res) => {
  const entry = db.prepare(
    'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.userId);

  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json(entry);
});

// Update journal entry
router.put('/:id', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const result = db.prepare(
    'UPDATE journal_entries SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
  ).run(title, content, req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  const entry = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(req.params.id);
  res.json(entry);
});

// Delete journal entry
router.delete('/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM journal_entries WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  res.json({ message: 'Entry deleted' });
});

module.exports = router;
