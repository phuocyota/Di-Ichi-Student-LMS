import { BadgeCheck } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import MiniMetric from '../components/common/MiniMetric.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { quizzes } from '../datas/lmsData.js';

function QuizPage() {
  return (
    <PageShell title="Quiz" subtitle="Luyện nhanh, xem điểm và mở khóa huy hiệu mới.">
      <QuizGrid />
    </PageShell>
  );
}

function QuizGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.title} quiz={quiz} />
      ))}
    </div>
  );
}

function QuizCard({ quiz }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]">
          <BadgeCheck className="h-9 w-9" />
        </div>
        <span className="rounded-3xl bg-green-50 px-3 py-1 text-sm font-black text-[#22C55E]">{quiz.start}</span>
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-900">{quiz.title}</h3>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <MiniMetric label="Câu" value={quiz.questions} />
        <MiniMetric label="Thời gian" value={quiz.duration} />
        <MiniMetric label="Điểm" value={quiz.score} />
      </div>
      <button className="mt-6 w-full rounded-3xl bg-[#2563EB] py-4 font-black text-white shadow-lg shadow-blue-200">Làm bài</button>
    </Card>
  );
}

export default QuizPage;
