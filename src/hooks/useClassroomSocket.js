import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken } from '../auth/authStorage.js';
import { getApiUrl } from '../services/apiClient.js';

export function useClassroomSocket({ scheduleId, identity, onPermissionChanged }) {
  const [activeSocket, setActiveSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!scheduleId) return undefined;
    const socket = io(`${getApiUrl()}/classroom`, {
      auth: { token: getAccessToken() },
      transports: ['websocket', 'polling'],
    });
    setActiveSocket(socket);
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('classroom:join', { scheduleId });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('classroom:permission-changed', (event) => {
      if (event.scheduleId === scheduleId && event.identity === identity) {
        onPermissionChanged(event.permissions);
      }
    });
    return () => {
      socket.disconnect();
      setActiveSocket(null);
      setConnected(false);
    };
  }, [identity, onPermissionChanged, scheduleId]);

  return { socket: activeSocket, connected };
}
