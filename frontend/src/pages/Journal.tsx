import { useState, useEffect } from 'react';
import { journalApi } from '../api';

export default function Journal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    try {
      const data = await journalApi.list(50);
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      if (editingId) {
        await journalApi.update(editingId, { title, content });
      } else {
        await journalApi.create({ title, content });
      }
      resetForm();
      loadEntries();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await journalApi.delete(id);
      loadEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Journal</h1>
          <p className="text-muted">{total} {total === 1 ? 'entry' : 'entries'}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => showForm ? resetForm() : setShowForm(true)}
        >
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card journal-form">
          <h2 className="card-title">{editingId ? 'Edit Entry' : 'New Journal Entry'}</h2>
          <div className="form-group">
            <input
              type="text" placeholder="Entry title"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your thoughts..."
              value={content} onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>
          <div className="form-actions">
            <button onClick={resetForm} className="btn btn-outline">Cancel</button>
            <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="empty-state">
          <h3>No journal entries yet</h3>
          <p>Writing about your thoughts and feelings can help you process emotions and gain clarity.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Write Your First Entry
          </button>
        </div>
      ) : (
        <div className="journal-entries">
          {entries.map((entry: any) => (
            <div key={entry.id} className="card journal-card">
              <div
                className="journal-card-header"
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              >
                <div>
                  <h3>{entry.title}</h3>
                  <span className="entry-date">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="expand-icon">{expandedId === entry.id ? '\u25B2' : '\u25BC'}</span>
              </div>
              {expandedId === entry.id ? (
                <div className="journal-card-body">
                  <p className="journal-content">{entry.content}</p>
                  <div className="journal-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(entry)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ) : (
                <p className="journal-preview">{entry.content.substring(0, 150)}...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
