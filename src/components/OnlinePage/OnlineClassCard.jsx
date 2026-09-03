import { Clock3, GraduationCap, MessageCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';

function OnlineClassCard({ item }) {
  return (
    <Card>
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]">
        <Video className="h-11 w-11" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">{item.className}</h3>
      <p className="mt-1 font-bold text-[#2563EB]">{item.courseName}</p>
      <div className="mt-4 space-y-3 text-base font-bold text-slate-600 sm:text-lg">
        <p><Clock3 className="mr-2 inline h-5 w-5 text-[#F97316]" />{formatScheduleTime(item.startAt, item.endAt)}</p>
        <p><GraduationCap className="mr-2 inline h-5 w-5 text-[#2563EB]" />{item.teacherName}</p>
        <p><MessageCircle className="mr-2 inline h-5 w-5 text-[#22C55E]" />{item.physicalRoom || 'Phòng học trực tuyến'}</p>
      </div>
      {item.canJoin ? (
        <Link to={`/online/${item.scheduleId}`} className="mt-8 block w-full rounded-3xl bg-[#F97316] py-5 text-center text-xl font-black text-white shadow-lg shadow-orange-200">Tham gia</Link>
      ) : (
        <div className="mt-8 rounded-3xl bg-slate-100 px-4 py-4 text-center font-black text-slate-500">{item.joinReason}</div>
      )}
    </Card>
  );
}

function formatScheduleTime(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const date = new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(start);
  const time = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time.format(start)} - ${time.format(end)}`;
}

export default OnlineClassCard;
