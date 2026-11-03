import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createRealtimeSocket } from "../services/realtime.js";
import { useClassroomSocket } from "./useClassroomSocket.js";
vi.mock("../services/realtime.js", () => ({ createRealtimeSocket: vi.fn() }));
let handlers, client, acknowledge;
beforeEach(() => {
  handlers = {};
  client = {
    on: vi.fn((name, fn) => {
      handlers[name] = fn;
    }),
    timeout: vi.fn(() => client),
    emit: vi.fn((_name, _payload, cb) => {
      if (cb) acknowledge = cb;
    }),
    disconnect: vi.fn(),
  };
  createRealtimeSocket.mockReturnValue(client);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it("only marks the room ready after acknowledgment and restores permissions after reconnect", () => {
  const changed = vi.fn();
  const { result } = renderHook(() =>
    useClassroomSocket({
      scheduleId: "s1",
      identity: "user-u1",
      onPermissionChanged: changed,
    }),
  );
  act(() => handlers.connect());
  expect(result.current.connected).toBe(false);
  act(() =>
    acknowledge(null, {
      scheduleId: "s1",
      permissions: { canWriteBoard: false },
    }),
  );
  expect(result.current.connected).toBe(true);
  expect(changed).toHaveBeenLastCalledWith({ canWriteBoard: false });
  expect(client.emit).toHaveBeenCalledWith("board:snapshot-request", {
    scheduleId: "s1",
  });
  act(() => handlers.disconnect());
  expect(result.current.connected).toBe(false);
  act(() => {
    handlers.connect();
    acknowledge(null, {
      scheduleId: "s1",
      permissions: { canWriteBoard: true },
    });
  });
  expect(changed).toHaveBeenLastCalledWith({ canWriteBoard: true });
});
it("does not reconnect just because the permission callback changes and ignores other students", () => {
  const first = vi.fn(),
    second = vi.fn();
  const { rerender } = renderHook(
    ({ callback }) =>
      useClassroomSocket({
        scheduleId: "s1",
        identity: "user-u1",
        onPermissionChanged: callback,
      }),
    { initialProps: { callback: first } },
  );
  rerender({ callback: second });
  expect(createRealtimeSocket).toHaveBeenCalledTimes(1);
  act(() =>
    handlers["classroom:permission-changed"]({
      scheduleId: "s1",
      identity: "user-other",
      permissions: {},
    }),
  );
  expect(second).not.toHaveBeenCalled();
  act(() =>
    handlers["classroom:permission-changed"]({
      scheduleId: "s1",
      identity: "user-u1",
      permissions: { canUseMic: false },
    }),
  );
  expect(second).toHaveBeenCalledWith({ canUseMic: false });
});
