const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'app.db'));

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mood_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood INTEGER NOT NULL CHECK(mood >= 1 AND mood <= 5),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default resources if table is empty
const resourceCount = db.prepare('SELECT COUNT(*) as count FROM resources').get();
if (resourceCount.count === 0) {
  const insert = db.prepare(
    'INSERT INTO resources (title, description, category, url) VALUES (?, ?, ?, ?)'
  );

  const resources = [
    ['Understanding Anxiety', 'Learn about the causes, symptoms, and coping strategies for anxiety disorders.', 'anxiety', 'https://www.nimh.nih.gov/health/topics/anxiety-disorders'],
    ['Mindfulness Meditation Guide', 'A beginner-friendly guide to mindfulness meditation for stress reduction.', 'mindfulness', 'https://www.mindful.org/how-to-meditate/'],
    ['Cognitive Behavioral Therapy Basics', 'Introduction to CBT techniques you can practice on your own.', 'therapy', 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral'],
    ['Sleep Hygiene Tips', 'Evidence-based strategies for improving your sleep quality.', 'sleep', 'https://www.sleepfoundation.org/sleep-hygiene'],
    ['Managing Depression', 'Resources and strategies for understanding and managing depression.', 'depression', 'https://www.nimh.nih.gov/health/topics/depression'],
    ['Breathing Exercises for Stress', 'Simple breathing techniques to calm your nervous system.', 'stress', 'https://www.healthline.com/health/breathing-exercises-for-anxiety'],
    ['Building Resilience', 'Learn how to develop emotional resilience and bounce back from adversity.', 'resilience', 'https://www.apa.org/topics/resilience'],
    ['Healthy Relationships', 'Guide to building and maintaining healthy interpersonal relationships.', 'relationships', 'https://www.mentalhealth.org.uk/explore-mental-health/articles/how-support-someone-mental-health-problem'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(...item);
    }
  });

  insertMany(resources);
}

module.exports = db;
