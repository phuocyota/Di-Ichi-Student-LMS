import { useCallback, useEffect, useState } from 'react';
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  StartAudio,
  useRoomContext,
  useTracks,
} from '@livekit/components-react';
import { Hand } from 'lucide-react';
import { Track } from 'livekit-client';
import { useClassroomSocket } from '../../hooks/useClassroomSocket.js';
import ClassroomBoard from './ClassroomBoard.jsx';

function ClassroomExperience({ joinData, onLeave, onDeviceError }) {
  const room = useRoomContext();
  const [permissions, setPermissions] = useState(joinData.permissions);
  const [handRaised, setHandRaised] = useState(false);
  const onPermissionChanged = useCallback((next) => setPermissions(next), []);
  const socket = useClassroomSocket({
    scheduleId: joinData.scheduleId,
    identity: joinData.identity,
    onPermissionChanged,
  });
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  useEffect(() => {
    if (!permissions.canUseMic) void room.localParticipant.setMicrophoneEnabled(false);
    if (!permissions.canUseCamera) void room.localParticipant.setCameraEnabled(false);
    if (!permissions.canShareScreen) void room.localParticipant.setScreenShareEnabled(false);
  }, [permissions, room]);

  function toggleHand() {
    const raised = !handRaised;
    setHandRaised(raised);
    socket?.emit('classroom:raise-hand', {
      scheduleId: joinData.scheduleId,
      raised,
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-3xl bg-slate-950 text-white" data-lk-theme="default">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase text-orange-400">Lớp học trực tuyến</p>
          <h1 className="text-xl font-black">{joinData.displayName}</h1>
        </div>
        <button type="button" onClick={onLeave} className="rounded-2xl bg-red-500 px-4 py-2 font-black">Rời lớp</button>
      </header>
      <GridLayout tracks={tracks} className="lk-grid-layout flex-1 p-4">
        <ParticipantTile />
      </GridLayout>
      <RoomAudioRenderer />
      <StartAudio label="Bật âm thanh" />
      <ClassroomBoard
        socket={socket}
        scheduleId={joinData.scheduleId}
        permissions={permissions}
      />
      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 p-3">
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
          <button type="button" onClick={toggleHand} className={`flex items-center gap-2 rounded-xl px-4 py-3 font-black ${handRaised ? 'bg-orange-500' : 'bg-slate-700'}`}>
            <Hand className="h-5 w-5" />
            {handRaised ? 'Hạ tay' : 'Giơ tay'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ClassroomExperience;
