import { FileText } from 'lucide-react';
import Card from '../common/Card.jsx';
import MiniMetric from '../common/MiniMetric.jsx';

function TaskCard({ item, action }) {
  const tone = item.color === 'green' ? 'text-[#22C55E] bg-green-50' : item.color === 'blue' ? 'text-[#2563EB] bg-blue-50' : 'text-[#F97316] bg-orange-50';

  return (
    <Card>
      <div className={`grid h-16 w-16 place-items-center rounded-3xl ${tone}`}>
        <FileText className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h3>
      <p className="mt-2 font-bold text-slate-500">Hạn nộp: {item.due}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MiniMetric label="Trạng thái" value={item.status} />
        <MiniMetric label="Điểm" value={item.score} />
      </div>
      <button className="mt-6 w-full rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200">
        {action}
      </button>
    </Card>
  );
}

export default TaskCard;
