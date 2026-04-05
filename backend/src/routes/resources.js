const express = require('express');
const db = require('../database');

const router = express.Router();

// Get all resources (public)
router.get('/', (req, res) => {
  const { category } = req.query;

  let entries;
  if (category) {
    entries = db.prepare(
      'SELECT * FROM resources WHERE category = ? ORDER BY created_at DESC'
    ).all(category);
  } else {
    entries = db.prepare('SELECT * FROM resources ORDER BY category, created_at DESC').all();
  }

  res.json(entries);
});

// Get resource categories
router.get('/categories', (req, res) => {
  const categories = db.prepare(
    'SELECT DISTINCT category, COUNT(*) as count FROM resources GROUP BY category ORDER BY category'
  ).all();
  res.json(categories);
});

module.exports = router;
