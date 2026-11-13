import { apiRequest } from './apiClient.js';

export function getOnlineSchedules() {
  return apiRequest('/student/schedules/online');
}

export function joinClassroom(scheduleId) {
  return apiRequest(`/schedule/${encodeURIComponent(scheduleId)}/livekit/join`, {
    method: 'POST',
  });
}

export const getOnlineSession = (id) => apiRequest(`/schedule/${encodeURIComponent(id)}/online-session`);
export const isFeatureDisabledError = (error) => error?.status === 404;
