import { ClassroomWhiteboard } from './ClassroomWhiteboard.jsx';
import { ClassroomLesson } from './ClassroomLesson.jsx';
import './classroom.css';
import { BookOpen, PenLine, Radio } from 'lucide-react';
import { ClassroomStage } from './ClassroomStage.jsx';
import { ClassroomPanels } from './ClassroomPanels.jsx';
import { ConnectionBanner } from './ConnectionBanner.jsx';
import { useCallback, useEffect, useState } from 'react';
import {
  ControlBar,
  LayoutContextProvider,
  RoomAudioRenderer,
  StartAudio,
  useRoomContext,
  useParticipants,
  useTracks,
} from '@livekit/components-react';
import { Hand } from 'lucide-react';
import { Track } from 'livekit-client';
import { useClassroomSocket } from '../../hooks/useClassroomSocket.js';
import ClassroomBoard from './ClassroomBoard.jsx';

function ClassroomExperience({ joinData, onLeave, onEnded, onDeviceError }) {
  const [showLesson, setShowLesson] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const closeBoard = useCallback(() => setBoardOpen(false), []);
  const room = useRoomContext();
  const [permissions, setPermissions] = useState(joinData.permissions);
  const [handRaised, setHandRaised] = useState(false);
  const openLesson = useCallback(() => setShowLesson(true), []);
  const onPresentationChange = useCallback((active) => {
    setPresenting(active);
    if (!active) setShowLesson(false);
  }, []);
  const onPermissionChanged = useCallback((next) => setPermissions(next), []);
  const { socket, connected } = useClassroomSocket({
    scheduleId: joinData.scheduleId,
    identity: joinData.identity,
    onPermissionChanged,
    onEnded,
  });
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  useEffect(() => {
    if (!permissions.canUseMic)
      void room.localParticipant.setMicrophoneEnabled(false);
    if (!permissions.canUseCamera)
      void room.localParticipant.setCameraEnabled(false);
    if (!permissions.canShareScreen)
      void room.localParticipant.setScreenShareEnabled(false);
  }, [permissions, room]);

  useEffect(() => {
    if (!socket || !connected) return;
    const replay = (event) => {
      if (!event || event.role === 'teacher')
        socket.emit('classroom:raise-hand', {
          scheduleId: joinData.scheduleId,
          raised: handRaised,
        });
    };
    replay();
    socket.on('classroom:participant-joined', replay);
    return () => socket.off('classroom:participant-joined', replay);
  }, [socket, connected, handRaised, joinData.scheduleId]);
  function toggleHand() {
    if (connected) setHandRaised((raised) => !raised);
  }

  return (
    <LayoutContextProvider>
      <div
        className="live-classroom flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-3xl bg-slate-950 text-white"
        data-lk-theme="default"
      >
        <ConnectionBanner />
        <header className="live-header flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <p className="live-eyebrow">
              <Radio size={14} aria-hidden="true" /> Lớp học trực tuyến
            </p>
            <h1 className="live-title text-xl font-black">
              {joinData.className || joinData.displayName}
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              {participants.length} người tham gia ·{' '}
              <span
                className={
                  connected ? 'live-status' : 'live-status live-status--waiting'
                }
              >
                {connected ? 'Đã kết nối' : 'Đang kết nối lại'}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="live-open-lesson"
              aria-expanded={showLesson}
              aria-controls="live-lesson-workspace"
              onClick={openLesson}
            >
              <BookOpen size={18} aria-hidden="true" /> Mở giáo án
            </button>
            {presenting && (
              <span className="live-presentation-badge" role="status">
                Giáo viên đang trình chiếu
              </span>
            )}
            <button
              type="button"
              onClick={onLeave}
              className="rounded-2xl bg-red-500 px-4 py-2 font-black"
            >
              Rời lớp
            </button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <main className="live-main flex min-w-0 flex-1 flex-col">
            <div
              className={`live-meeting-stage${showLesson ? ' live-meeting-stage--presenting' : ''}`}
            >
              <div
                id="live-lesson-workspace"
                className="live-lesson-focus"
                hidden={!showLesson}
              >
                <ClassroomLesson
                  socket={socket}
                  connected={connected}
                  joinData={joinData}
                  onPresent={openLesson}
                  onPresentationChange={onPresentationChange}
                />
              </div>
              <div
                className="live-camera-zone"
                aria-label={showLesson ? 'Video người tham gia' : 'Phòng học'}
              >
                {showLesson && (
                  <p className="live-camera-heading">Người tham gia</p>
                )}
                <ClassroomStage
                  tracks={tracks}
                  hostIdentity={joinData.hostIdentity}
                  compact={showLesson}
                />
              </div>
            </div>
            <RoomAudioRenderer />
            <StartAudio label="Bật âm thanh" />
            <ClassroomWhiteboard open={boardOpen} onClose={closeBoard}>
              <ClassroomBoard
                socket={socket}
                scheduleId={joinData.scheduleId}
                permissions={permissions}
              />
            </ClassroomWhiteboard>
            <div className="live-controls flex flex-wrap items-center justify-center gap-3 border-t border-white/10 p-3">
              <div className="live-meeting-tools" aria-label="Công cụ lớp học">
                <button
                  type="button"
                  className="live-tool-button"
                  aria-expanded={boardOpen}
                  aria-controls="live-whiteboard"
                  onClick={() => setBoardOpen(true)}
                >
                  <PenLine size={18} aria-hidden="true" /> Bảng trắng
                </button>
                <button
                  type="button"
                  className="live-tool-button"
                  aria-pressed={showLesson}
                  onClick={() => {
                    setShowLesson((value) => !value);
                  }}
                >
                  <BookOpen size={18} aria-hidden="true" />{' '}
                  {showLesson ? 'Ẩn giáo án' : 'Giáo án'}
                </button>
              </div>
              <ControlBar
                variation="minimal"
                controls={{
                  microphone: permissions.canUseMic,
                  camera: permissions.canUseCamera,
                  screenShare: permissions.canShareScreen,
                  chat: false,
                  settings: true,
                  leave: false,
                }}
                onDeviceError={({ error }) => onDeviceError(error.message)}
              />
              {joinData.role === 'student' ? (
                <button
                  type="button"
                  onClick={toggleHand}
                  disabled={!connected}
                  aria-pressed={handRaised}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 font-black ${handRaised ? 'bg-orange-500' : 'bg-slate-700'}`}
                >
                  <Hand className="h-5 w-5" />
                  {handRaised ? 'Hạ tay' : 'Giơ tay'}
                </button>
              ) : null}
            </div>
          </main>
          <ClassroomPanels />
        </div>
      </div>
    </LayoutContextProvider>
  );
}

export default ClassroomExperience;
