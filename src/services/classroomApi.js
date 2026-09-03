import { apiRequest } from './apiClient.js';

export function getOnlineSchedules() {
  return apiRequest('/student/schedules/online');
}

export function joinClassroom(scheduleId) {
  return apiRequest(`/schedule/${encodeURIComponent(scheduleId)}/livekit/join`, {
    method: 'POST',
  });
}
