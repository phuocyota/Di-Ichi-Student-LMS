import { apiRequest } from './apiClient.js';

export function login(email, password) {
  return apiRequest('/auth/student/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
