import { apiRequest, getApiUrl } from './apiClient.js';
import { clearAccessToken, getAccessToken } from '../auth/authStorage.js';

export function getClassLessonPlans(signal) {
  return apiRequest('/portal/class-lesson-plans', { signal });
}

export function getClassLessonPlan(id, signal) {
  return apiRequest(`/portal/class-lesson-plans/${encodeURIComponent(id)}`, { signal });
}

export function submitLessonAnswer(id, body) {
  return apiRequest(`/portal/class-lesson-plans/${encodeURIComponent(id)}/answers`, {
    method: 'POST', body: JSON.stringify(body),
  });
}

export async function downloadPortalImage(id, signal) {
  const response = await fetch(`${getApiUrl()}/portal/files/${encodeURIComponent(id)}`, {
    signal,
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (response.status === 401) clearAccessToken();
  if (!response.ok) throw new Error('Không tải được ảnh nền của giáo án');
  return response.blob();
}
