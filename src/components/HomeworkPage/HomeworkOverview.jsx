import { AlertCircle, CheckCircle2, ClipboardCheck, FileCheck2 } from 'lucide-react';
import Card from '../common/Card.jsx';
import { homework } from '../../datas/homeworkData.js';

const toneStyles = {
  orange: 'bg-orange-50 text-[#F97316]',
  green: 'bg-green-50 text-[#22C55E]',
  blue: 'bg-blue-50 text-[#2563EB]',
  red: 'bg-red-50 text-[#EF4444]',
};

const icons = {
  orange: ClipboardCheck,
  green: CheckCircle2,
  blue: FileCheck2,
  red: AlertCircle,
};

function HomeworkOverview() {
  const homeworkStats = [
    { label: 'Cần nộp', value: homework.filter((item) => item.status === 'Cần nộp').length, tone: 'orange' },
    { label: 'Đã nộp', value: homework.filter((item) => item.status === 'Đã nộp').length, tone: 'green' },
    { label: 'Đã chấm', value: homework.filter((item) => item.status === 'Đã chấm').length, tone: 'blue' },
    { label: 'Quá hạn', value: homework.filter((item) => item.status === 'Quá hạn').length, tone: 'red' },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {homeworkStats.map((stat) => {
        const Icon = icons[stat.tone];
        return (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-3xl ${toneStyles[stat.tone]}`}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-slate-400">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

export default HomeworkOverview;
