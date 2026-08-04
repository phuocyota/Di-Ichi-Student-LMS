import { BookOpen, CalendarClock, ChevronRight, Clock3, FileText } from 'lucide-react';
import Card from '../common/Card.jsx';

function TaskCard({ item, selected, onSelect }) {
  const tone = item.color === 'green'
    ? 'text-[#22C55E] bg-green-50'
    : item.color === 'blue'
      ? 'text-[#2563EB] bg-blue-50'
      : item.color === 'red'
        ? 'text-[#EF4444] bg-red-50'
        : 'text-[#F97316] bg-orange-50';

  return (
    <button type="button" onClick={onSelect} className="h-full text-left">
      <Card className={`flex h-full flex-col ring-2 transition ${selected ? 'ring-[#F97316]' : 'ring-transparent'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-3xl ${tone}`}>
          <FileText className="h-9 w-9" />
        </div>
        <span className={`rounded-3xl px-3 py-1 text-sm font-black ${tone}`}>{item.status}</span>
      </div>

      <div className="mt-5">
        <p className="text-sm font-black uppercase text-[#F97316]">{item.type}</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">{item.title}</h3>
      </div>

      <div className="mt-5 grid gap-3">
        <MetaItem icon={BookOpen} label="Khóa học" value={item.course} />
        <MetaItem icon={CalendarClock} label="Hạn nộp" value={item.due} />
        <MetaItem icon={Clock3} label="Thời lượng" value={item.estimatedTime} />
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
          <span className="font-bold text-slate-500">Điểm hiện tại</span>
          <span className="font-black text-slate-900">{item.score}</span>
        </div>
        <div className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl py-4 font-black ${selected ? 'bg-[#2563EB] text-white' : 'bg-orange-50 text-[#F97316]'}`}>
          {selected ? 'Đang xem chi tiết' : 'Xem chi tiết'}
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
      </Card>
    </button>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-[#F97316]" />
      <p className="mt-2 text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-800">{value}</p>
    </div>
  );
}

export default TaskCard;
