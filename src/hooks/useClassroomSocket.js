import { useEffect, useRef, useState } from "react";
import { createRealtimeSocket } from "../services/realtime.js";
export function useClassroomSocket({
  scheduleId,
  identity,
  onPermissionChanged,
}) {
  const [socket, setSocket] = useState(null),
    [connected, setConnected] = useState(false);
  const latest = useRef(onPermissionChanged);
  useEffect(() => {
    latest.current = onPermissionChanged;
  });
  useEffect(() => {
    if (!scheduleId) return;
    let active = true;
    const client = createRealtimeSocket("classroom");
    setSocket(client);
    const join = () => {
      client.classroomReady = false;
      client
        .timeout(5000)
        .emit("classroom:join", { scheduleId }, (error, response) => {
          if (!active) return;
          const result = response?.data ?? response;
          const ready =
            !error &&
            result?.scheduleId === scheduleId &&
            result.realtimeReady !== false;
          client.classroomReady = ready;
          setConnected(ready);
          if (ready) {
            if (result.permissions) latest.current?.(result.permissions);
            client.emit("board:snapshot-request", { scheduleId });
          }
        });
    };
    client.on("connect", join);
    client.on("classroom:transport-status", (event) => {
      if (!active) return;
      if (!event?.ready) {
        client.classroomReady = false;
        setConnected(false);
      } else if (client.connected) join();
    });
    client.on('classroom:ended', event => { if (event?.scheduleId === scheduleId && active) { client.classroomReady = false; setConnected(false); } });
    client.on("disconnect", () => {
      client.classroomReady = false;
      if (active) setConnected(false);
    });
    client.on("connect_error", () => {
      if (active) setConnected(false);
    });
    client.on("exception", () => {
      client.classroomReady = false;
      if (active) setConnected(false);
    });
    client.on("classroom:permission-changed", (event) => {
      if (event?.scheduleId === scheduleId && event.identity === identity)
        latest.current?.(event.permissions);
    });
    return () => {
      active = false;
      client.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [identity, scheduleId]);
  return { socket, connected };
}
