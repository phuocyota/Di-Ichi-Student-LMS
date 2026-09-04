import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getAccessToken } from '../auth/authStorage.js';
import { getApiUrl } from '../services/apiClient.js';

export function useClassroomSocket({ scheduleId, identity, onPermissionChanged }) {
  const [activeSocket, setActiveSocket] = useState(null);

  useEffect(() => {
    if (!scheduleId) return undefined;
    const socket = io(`${getApiUrl()}/classroom`, {
      auth: { token: getAccessToken() },
      transports: ['websocket', 'polling'],
    });
    setActiveSocket(socket);
    socket.on('connect', () => {
      socket.emit('classroom:join', { scheduleId });
    });
    socket.on('classroom:permission-changed', (event) => {
      if (event.scheduleId === scheduleId && event.identity === identity) {
        onPermissionChanged(event.permissions);
      }
    });
    return () => {
      socket.disconnect();
      setActiveSocket(null);
    };
  }, [identity, onPermissionChanged, scheduleId]);

  return activeSocket;
}
