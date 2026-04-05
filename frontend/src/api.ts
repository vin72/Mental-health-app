const API_BASE = '/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

// Auth
export const authApi = {
  register: (body: { username: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

// Mood
export const moodApi = {
  create: (body: { mood: number; note?: string }) =>
    request('/mood', { method: 'POST', body: JSON.stringify(body) }),
  list: (limit = 30) => request(`/mood?limit=${limit}`),
  stats: (days = 7) => request(`/mood/stats?days=${days}`),
  delete: (id: number) => request(`/mood/${id}`, { method: 'DELETE' }),
};

// Journal
export const journalApi = {
  create: (body: { title: string; content: string }) =>
    request('/journal', { method: 'POST', body: JSON.stringify(body) }),
  list: (limit = 20, offset = 0) => request(`/journal?limit=${limit}&offset=${offset}`),
  get: (id: number) => request(`/journal/${id}`),
  update: (id: number, body: { title: string; content: string }) =>
    request(`/journal/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) => request(`/journal/${id}`, { method: 'DELETE' }),
};

// Resources
export const resourcesApi = {
  list: (category?: string) => request(`/resources${category ? `?category=${category}` : ''}`),
  categories: () => request('/resources/categories'),
};
