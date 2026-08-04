import { BadgeCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';
import MiniMetric from '../common/MiniMetric.jsx';

function QuizCard({ quiz }) {
  return (
    <Link to={`/quiz/${quiz.id}`} className="block h-full">
      <Card className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]">
            <BadgeCheck className="h-9 w-9" />
          </div>
          <span className="rounded-3xl bg-green-50 px-3 py-1 text-sm font-black text-[#22C55E]">{quiz.start}</span>
        </div>
        <p className="mt-5 text-sm font-black uppercase text-[#F97316]">{quiz.skill}</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">{quiz.title}</h3>
        <p className="mt-2 font-bold text-slate-500">{quiz.course}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <MiniMetric label="Câu" value={quiz.questions} />
          <MiniMetric label="Thời gian" value={quiz.duration} />
          <MiniMetric label="Điểm" value={quiz.score} />
        </div>
        <div className="mt-auto pt-6">
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#2563EB] py-4 font-black text-white shadow-lg shadow-blue-200">
            Xem chi tiết <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default QuizCard;
