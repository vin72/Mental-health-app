import { useState, useEffect } from 'react';
import { moodApi } from '../api';
import MoodChart from '../components/MoodChart';

const moodEmojis = ['', '\u{1F629}', '\u{1F61E}', '\u{1F610}', '\u{1F642}', '\u{1F601}'];
const moodLabels = ['', 'Awful', 'Bad', 'Okay', 'Good', 'Great'];

export default function MoodTracker() {
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [mood, setMood] = useState(0);
  const [note, setNote] = useState('');
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, [days]);

  const loadData = async () => {
    try {
      const [list, statsData] = await Promise.all([
        moodApi.list(50),
        moodApi.stats(days),
      ]);
      setEntries(list);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (mood === 0) return;
    setError('');
    try {
      await moodApi.create({ mood, note: note || undefined });
      setMood(0);
      setNote('');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await moodApi.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Mood Tracker</h1>
      <p className="text-muted">Track how you're feeling over time</p>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Log New Mood */}
      <div className="card">
        <h2 className="card-title">How are you feeling right now?</h2>
        <div className="mood-selector large">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              className={`mood-btn ${mood === level ? 'selected' : ''}`}
              onClick={() => setMood(level)}
            >
              <span className="mood-emoji">{moodEmojis[level]}</span>
              <span className="mood-label">{moodLabels[level]}</span>
            </button>
          ))}
        </div>
        {mood > 0 && (
          <div className="mood-form">
            <textarea
              placeholder="What's on your mind? (optional)"
              value={note} onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <button onClick={handleSubmit} className="btn btn-primary">
              Log Mood
            </button>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Mood Over Time</h2>
          <div className="btn-group">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                className={`btn btn-sm ${days === d ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setDays(d)}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        <MoodChart data={stats?.daily || []} />
      </div>

      {/* Entry History */}
      <div className="card">
        <h2 className="card-title">History</h2>
        {entries.length === 0 ? (
          <p className="text-muted">No entries yet. Log your first mood above!</p>
        ) : (
          <div className="mood-history">
            {entries.map((entry: any) => (
              <div key={entry.id} className="mood-history-item">
                <span className="mood-emoji-sm">{moodEmojis[entry.mood]}</span>
                <div className="mood-history-content">
                  <div className="mood-history-header">
                    <strong>{moodLabels[entry.mood]}</strong>
                    <span className="entry-date">
                      {new Date(entry.created_at).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {entry.note && <p className="entry-note">{entry.note}</p>}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(entry.id)}
                  title="Delete entry"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
