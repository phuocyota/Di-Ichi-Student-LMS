import { useEffect, useState } from 'react';
import OnlineClassCard from './OnlineClassCard.jsx';
import { getOnlineSchedules } from '../../services/classroomApi.js';

function OnlineClassGrid() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getOnlineSchedules()
      .then((data) => active && setClasses(data))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="rounded-3xl bg-white p-8 text-center text-lg font-black text-slate-500">Đang tải lịch học...</p>;
  if (error) return <p className="rounded-3xl bg-red-50 p-6 font-bold text-red-600">{error}</p>;
  if (!classes.length) return <p className="rounded-3xl bg-white p-8 text-center text-lg font-black text-slate-500">Chưa có buổi học online sắp tới.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {classes.map((item) => (
        <OnlineClassCard key={item.scheduleId} item={item} />
      ))}
    </div>
  );
}

export default OnlineClassGrid;
