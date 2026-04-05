import { useState, useEffect } from 'react';
import { resourcesApi } from '../api';

const categoryColors: Record<string, string> = {
  anxiety: '#f59e0b',
  mindfulness: '#10b981',
  therapy: '#6c63ff',
  sleep: '#3b82f6',
  depression: '#8b5cf6',
  stress: '#ef4444',
  resilience: '#14b8a6',
  relationships: '#ec4899',
};

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  useEffect(() => { loadResources(); }, [activeCategory]);

  const loadData = async () => {
    try {
      const cats = await resourcesApi.categories();
      setCategories(cats);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadResources = async () => {
    try {
      const data = await resourcesApi.list(activeCategory || undefined);
      setResources(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Mental Health Resources</h1>
      <p className="text-muted">Curated resources to support your mental wellness journey</p>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Category Filters */}
      <div className="category-filters">
        <button
          className={`category-tag ${activeCategory === '' ? 'active' : ''}`}
          onClick={() => setActiveCategory('')}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.category}
            className={`category-tag ${activeCategory === cat.category ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.category)}
            style={activeCategory === cat.category ? {
              backgroundColor: categoryColors[cat.category] || '#6c63ff',
              borderColor: categoryColors[cat.category] || '#6c63ff',
            } : {}}
          >
            {cat.category} ({cat.count})
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="resource-grid">
        {resources.map((resource: any) => (
          <div key={resource.id} className="card resource-card">
            <div
              className="resource-category-badge"
              style={{ backgroundColor: categoryColors[resource.category] || '#6c63ff' }}
            >
              {resource.category}
            </div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Learn More &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
