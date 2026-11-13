import { useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import { VideoPresets } from 'livekit-client';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useClassroomSession } from '../hooks/useClassroomSession.js';
import { PreJoinPanel } from '../components/Classroom/PreJoinPanel.jsx';
import { SessionEndedScreen } from '../components/Classroom/SessionEndedScreen.jsx';
import ClassroomExperience from '../components/Classroom/ClassroomExperience.jsx';

const roomOptions = { adaptiveStream: true, dynacast: true, videoCaptureDefaults: { resolution: VideoPresets.h360.resolution }, publishDefaults: { simulcast: true, screenShareEncoding: { maxBitrate: 3000000, maxFramerate: 15 } } };
export default function ClassroomPage() {
  const { scheduleId } = useParams();
  const [mediaError, setMediaError] = useState('');
  const navigate = useNavigate();
  const flow = useClassroomSession(scheduleId);
  const back = () => { flow.finish('left'); navigate('/online'); };
  if (!scheduleId) return <Navigate to="/online" replace />;
  if (['ended', 'removed', 'duplicate', 'disconnected'].includes(flow.state)) return <SessionEndedScreen state={flow.state} onBack={back} />;
  if (flow.state === 'left') return null;
  if (flow.state === 'live' && flow.joinData) {
    const data = { ...flow.joinData, classId: flow.detail?.classId ?? flow.joinData.classId, features: flow.detail?.features || {}, isHost: flow.detail?.me?.isHost ?? flow.joinData.isHost };
    const choices = flow.choices || {};
    return <LiveKitRoom serverUrl={data.serverUrl} token={data.token} options={roomOptions} connect
      audio={choices.audioEnabled && data.permissions?.canUseMic !== false ? { deviceId: choices.audioDeviceId } : false}
      video={choices.videoEnabled && data.permissions?.canUseCamera !== false ? { deviceId: choices.videoDeviceId } : false}
      onDisconnected={flow.disconnect} onError={() => setMediaError('Không thể kết nối lớp học. Vui lòng thử lại.')} className="min-h-screen">
      {mediaError && <p role="alert" className="bg-amber-100 p-3 text-amber-950">{mediaError}</p>}
      <ClassroomExperience joinData={data} onLeave={back} onEnded={() => flow.finish('ended')} onDeviceError={() => setMediaError('Không truy cập được thiết bị. Bạn vẫn có thể vào lớp chỉ nghe.')} />
    </LiveKitRoom>;
  }
  return <div className="min-h-screen bg-slate-950 text-white">
    {flow.error && <div role="alert" className="p-5 text-center"><p>{flow.error}</p><button type="button" onClick={flow.retry}>Thử lại</button></div>}
    {flow.state === 'detail' && !flow.error && <p className="p-8 text-center">Đang tải thông tin lớp học…</p>}
    {flow.state === 'prejoin' && <PreJoinPanel onSubmit={flow.enter} busy={flow.busy} displayName={flow.detail?.className} />}
    <button type="button" onClick={back} className="m-5">Quay lại danh sách lớp</button>
  </div>;
}
