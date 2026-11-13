import { expect, it, vi } from 'vitest';
import { apiRequest } from './apiClient.js';
import { getOnlineSession } from './classroomApi.js';
vi.mock('./apiClient.js', () => ({ apiRequest: vi.fn() }));
it('loads A1 with an encoded schedule ID', () => {
  getOnlineSession('a/b');
  expect(apiRequest).toHaveBeenCalledExactlyOnceWith('/schedule/a%2Fb/online-session');
});
