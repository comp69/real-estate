import axios from 'axios';

// Use Vite env var if provided, otherwise default to the current origin
// This makes the frontend work when hosted on another host without hard-coded localhost
const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    Accept: 'application/json'
  }
});

export function storageUrl(path) {
  if (!path) return '';
  // Ensure no leading slash duplication
  const base = API_BASE.replace(/\/$/, '');
  return `${base}/storage/${path.replace(/^\//, '')}`;
}

export default api;
