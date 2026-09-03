import { clearAccessToken, getAccessToken } from '../auth/authStorage.js';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (response.status === 401) clearAccessToken();
  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || 'Không thể kết nối tới máy chủ');
    error.status = response.status;
    throw error;
  }
  return payload?.data ?? payload;
}

export function getApiUrl() {
  return API_URL;
}
