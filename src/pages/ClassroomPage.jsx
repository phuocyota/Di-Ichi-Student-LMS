import { useEffect, useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ClassroomExperience from '../components/Classroom/ClassroomExperience.jsx';
import { joinClassroom } from '../services/classroomApi.js';

function ClassroomPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [joinData, setJoinData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    joinClassroom(scheduleId)
      .then((data) => active && setJoinData(data))
      .catch((requestError) => active && setError(requestError.message));
    return () => {
      active = false;
    };
  }, [scheduleId]);

  if (!scheduleId) return <Navigate to="/online" replace />;
  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl shadow-orange-100">
        <h1 className="text-2xl font-black text-slate-900">Không thể vào lớp</h1>
        <p className="mt-3 font-semibold text-red-600">{error}</p>
        <button onClick={() => navigate('/online')} className="mt-6 rounded-2xl bg-[#F97316] px-5 py-3 font-black text-white">Quay lại lịch học</button>
      </div>
    );
  }
  if (!joinData) return <p className="py-20 text-center text-xl font-black text-slate-600">Đang kết nối lớp học...</p>;

  return (
    <LiveKitRoom
      serverUrl={joinData.serverUrl}
      token={joinData.token}
      connect
      audio={false}
      video={false}
      onDisconnected={() => navigate('/online')}
      onError={(roomError) => setError(roomError.message)}
      className="min-h-screen"
    >
      <ClassroomExperience joinData={joinData} onLeave={() => navigate('/online')} onDeviceError={setError} />
    </LiveKitRoom>
  );
}

export default ClassroomPage;
