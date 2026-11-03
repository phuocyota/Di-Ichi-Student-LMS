import { useResourceUpdates } from '../../services/realtime.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import OnlineClassCard from './OnlineClassCard.jsx';
import { getOnlineSchedules } from '../../services/classroomApi.js';
import { useOnlineScheduleWatcher } from '../../hooks/useOnlineScheduleWatcher.js';

function OnlineClassGrid() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOnlineSchedules();
      setClasses(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useResourceUpdates(() => load({ silent: true }), ['schedule','class','class-staff','enrollment','workspace','portal']);
  useEffect(() => {
    void load();
    const timer = window.setInterval(() => load({ silent: true }), 15000);
    const onFocus = () => load({ silent: true });
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [load]);

  const scheduleIds = useMemo(() => classes.map((item) => item.scheduleId), [classes]);
  const onStarted = useCallback((event) => {
    setClasses((current) => current.map((item) => item.scheduleId === event.scheduleId
      ? { ...item, meetingStarted: true, canJoin: true, joinReason: null }
      : item));
  }, []);
  useOnlineScheduleWatcher(scheduleIds, onStarted);

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
