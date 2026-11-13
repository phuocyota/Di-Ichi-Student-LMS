import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Room } from 'livekit-client';
import { RoomContext } from '@livekit/components-react';
import ClassroomExperience from './ClassroomExperience.jsx';

globalThis.React = React;
const mock = vi.hoisted(() => ({
  room: { localParticipant: {} },
}));

vi.mock('@livekit/components-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRoomContext: () => mock.room,
    useParticipants: () => [],
    useTracks: () => [],
    RoomAudioRenderer: () => null,
    StartAudio: () => null,
    // Exercise the real ControlBar and its internal Settings toggle.
    ControlBar: ({ controls }) => <actual.ControlBar variation="textOnly" saveUserChoices={false} controls={{
      ...controls, microphone: false, camera: false, screenShare: false,
    }} />,
  };
});
vi.mock('../../hooks/useClassroomSocket.js', () => ({
  useClassroomSocket: () => ({ socket: null, connected: false }),
}));
vi.mock('./ClassroomStage.jsx', () => ({ ClassroomStage: () => null }));
vi.mock('./ClassroomPanels.jsx', () => ({ ClassroomPanels: () => null }));
vi.mock('./ConnectionBanner.jsx', () => ({ ConnectionBanner: () => null }));
vi.mock('./ClassroomBoard.jsx', () => ({ default: () => null }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('provides LiveKit layout context when a student opens the classroom settings', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(),
  }));
  const room = new Room();
  render(<RoomContext.Provider value={room}><ClassroomExperience joinData={{
    scheduleId: 'schedule-1',
    identity: 'student-1',
    role: 'student',
    className: 'Lớp tiếng Nhật',
    permissions: { canUseMic: true, canUseCamera: true, canShareScreen: true },
  }} onLeave={vi.fn()} onEnded={vi.fn()} onDeviceError={vi.fn()} /></RoomContext.Provider>);

  expect(screen.getByRole('heading', { name: 'Lớp tiếng Nhật' })).toBeInTheDocument();
  const settings = screen.getByRole('button', { name: /settings/i });
  expect(settings).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(settings);
  expect(settings).toHaveAttribute('aria-pressed', 'true');
});
