import { useEffect, useRef, useState } from "react";
import { createRealtimeSocket } from "../services/realtime.js";
import { disposeRealtimeSocket } from "../services/socketSession.js";
import { subscribeSocket } from "../services/socketSubscription.js";
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
    const client = createRealtimeSocket("classroom");
    setSocket(client);
    const unavailable = () => {
      client.classroomReady = false;
      setConnected(false);
    };
    const stop = subscribeSocket(client, {
      event: "classroom:join",
      payload: { scheduleId },
      statusEvent: "classroom:transport-status",
      accept: (result) => result?.scheduleId === scheduleId,
      onUnavailable: unavailable,
      onReady: (result) => {
        client.classroomReady = true;
        setConnected(true);
        if (result.permissions) latest.current?.(result.permissions);
        client.emit("board:snapshot-request", { scheduleId });
      },
    });
    client.on("classroom:ended", (event) => {
      if (event?.scheduleId === scheduleId) {
        stop();
        unavailable();
      }
    });
    client.on("classroom:permission-changed", (event) => {
      if (event?.scheduleId === scheduleId && event.identity === identity)
        latest.current?.(event.permissions);
    });
    return () => {
      stop();
      disposeRealtimeSocket(client);
      setSocket(null);
      setConnected(false);
    };
  }, [identity, scheduleId]);
  return { socket, connected };
}
