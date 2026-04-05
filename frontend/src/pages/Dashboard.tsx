import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { moodApi, journalApi } from '../api';
import MoodChart from '../components/MoodChart';

const moodEmojis = ['', '\u{1F629}', '\u{1F61E}', '\u{1F610}', '\u{1F642}', '\u{1F601}'];

export default function Dashboard() {
  const { user } = useAuth();
  const [moodStats, setMoodStats] = useState<any>(null);
  const [recentMoods, setRecentMoods] = useState<any[]>([]);
  const [recentJournals, setRecentJournals] = useState<any[]>([]);
  const [quickMood, setQuickMood] = useState(0);
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stats, moods, journals] = await Promise.all([
        moodApi.stats(7),
        moodApi.list(5),
        journalApi.list(3),
      ]);
      setMoodStats(stats);
      setRecentMoods(moods);
      setRecentJournals(journals.entries);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  const handleQuickMood = async () => {
    if (quickMood === 0) return;
    try {
      await moodApi.create({ mood: quickMood, note: quickNote || undefined });
      setQuickMood(0);
      setQuickNote('');
      loadData();
    } catch (err) {
      console.error('Failed to log mood', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p className="text-muted">How are you feeling today?</p>
      </div>

      <div className="dashboard-grid">
        {/* Quick Mood Log */}
        <div className="card">
          <h2 className="card-title">Quick Mood Check-in</h2>
          <div className="mood-selector">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                className={`mood-btn ${quickMood === level ? 'selected' : ''}`}
                onClick={() => setQuickMood(level)}
              >
                <span className="mood-emoji">{moodEmojis[level]}</span>
                <span className="mood-label">
                  {['', 'Awful', 'Bad', 'Okay', 'Good', 'Great'][level]}
                </span>
              </button>
            ))}
          </div>
          {quickMood > 0 && (
            <div className="quick-mood-form">
              <input
                type="text" placeholder="Add a note (optional)"
                value={quickNote} onChange={(e) => setQuickNote(e.target.value)}
                className="mood-note-input"
              />
              <button onClick={handleQuickMood} className="btn btn-primary">
                Log Mood
              </button>
            </div>
          )}
        </div>

        {/* Mood Chart */}
        <div className="card">
          <h2 className="card-title">Your Week at a Glance</h2>
          <MoodChart data={moodStats?.daily || []} />
          {moodStats?.overall && moodStats.overall.total > 0 && (
            <p className="text-center text-muted">
              Average mood this week: <strong>{moodStats.overall.avg_mood}/5</strong> ({moodStats.overall.total} entries)
            </p>
          )}
        </div>

        {/* Recent Moods */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Moods</h2>
            <Link to="/mood" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {recentMoods.length === 0 ? (
            <p className="text-muted">No mood entries yet.</p>
          ) : (
            <ul className="entry-list">
              {recentMoods.map((m: any) => (
                <li key={m.id} className="entry-item">
                  <span className="mood-emoji-sm">{moodEmojis[m.mood]}</span>
                  <div>
                    <span className="entry-date">
                      {new Date(m.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </span>
                    {m.note && <p className="entry-note">{m.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Journal Entries */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Journal Entries</h2>
            <Link to="/journal" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {recentJournals.length === 0 ? (
            <p className="text-muted">No journal entries yet.</p>
          ) : (
            <ul className="entry-list">
              {recentJournals.map((j: any) => (
                <li key={j.id} className="entry-item">
                  <div>
                    <strong>{j.title}</strong>
                    <span className="entry-date">
                      {' '}{new Date(j.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                    </span>
                    <p className="entry-preview">{j.content.substring(0, 100)}...</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
