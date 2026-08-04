import { CalendarClock, ChevronRight, Download } from 'lucide-react';
import Card from '../common/Card.jsx';
import { iconMap } from '../icons/iconMap.jsx';

function MaterialCard({ item, selected, onSelect }) {
  const Icon = iconMap[item.icon];

  return (
    <Card className={`ring-2 transition ${selected ? 'ring-[#F97316]' : 'ring-transparent'}`}>
      <button type="button" onClick={onSelect} className="flex w-full items-start gap-4 text-left">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-orange-50">
          <Icon className={`h-8 w-8 ${item.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-3xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">{item.type}</span>
            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-400">
              <CalendarClock className="h-3.5 w-3.5" />
              {item.updatedAt}
            </span>
          </div>
          <h3 className="mt-2 text-xl font-black text-slate-900">{item.title}</h3>
          <p className="mt-1 font-bold text-slate-500">{item.course}</p>
        </div>
        <ChevronRight className={`mt-2 h-5 w-5 shrink-0 ${selected ? 'text-[#F97316]' : 'text-slate-300'}`} />
      </button>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onSelect} className="flex-1 rounded-3xl bg-orange-50 py-3 font-black text-[#F97316]">
          Xem preview
        </button>
        <a href={item.downloadUrl} download={item.fileName} className="grid h-12 w-12 place-items-center rounded-3xl bg-[#F97316] text-white shadow-md shadow-orange-200" aria-label="Tải tài liệu">
          <Download className="h-5 w-5" />
        </a>
      </div>
    </Card>
  );
}

export default MaterialCard;
