import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken } from '../auth/authStorage.js';
import { getApiUrl } from '../services/apiClient.js';

export function useOnlineScheduleWatcher(scheduleIds, onStarted) {
  const [connected, setConnected] = useState(false);
  const scheduleKey = scheduleIds.join(',');

  useEffect(() => {
    if (!scheduleIds.length) return undefined;
    const socket = io(`${getApiUrl()}/classroom`, {
      auth: { token: getAccessToken() },
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('classroom:watch', { scheduleIds });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('classroom:started', onStarted);
    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [onStarted, scheduleKey]); // scheduleKey intentionally represents the list contents.

  return connected;
}
