import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, BookOpen, CalendarClock, CheckCircle2, Clock3, ListChecks, PlayCircle, RotateCcw, Target, Trophy, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';
import MiniMetric from '../common/MiniMetric.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { getStoredQuizAttempts } from '../../utils/quizAttempts.js';

function QuizDetail({ quiz }) {
  const location = useLocation();
  const storedAttempts = getStoredQuizAttempts(quiz.id);
  const history = [...storedAttempts, ...quiz.history];
  const bestScore = getBestScore(history, quiz.bestScore);
  const submittedScore = location.state?.submittedScore;

  return (
    <div className="space-y-6">
      <Link to="/quiz" className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:text-[#F97316]">
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách quiz
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {submittedScore ? (
          <div className="rounded-3xl bg-green-50 p-5 font-black text-[#22C55E] shadow-lg shadow-green-100 lg:col-span-2">
            Đã nộp bài thành công. Điểm của em: {submittedScore}/10
          </div>
        ) : null}
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#F97316]">{quiz.skill}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">{quiz.title}</h2>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">{quiz.description}</p>
            </div>
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-[#2563EB] text-white shadow-lg shadow-blue-200">
              <BadgeCheck className="h-11 w-11" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniMetric label="Số câu" value={quiz.questions} />
            <MiniMetric label="Thời gian" value={quiz.duration} />
            <MiniMetric label="Độ khó" value={quiz.difficulty} />
            <MiniMetric label="Điểm tốt nhất" value={bestScore} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoPill icon={BookOpen} label="Khóa học" value={quiz.course} />
            <InfoPill icon={UserRound} label="Giáo viên" value={quiz.teacher} />
            <InfoPill icon={CalendarClock} label="Hạn làm" value={quiz.deadline} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to={`/quiz/${quiz.id}/take`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-3xl bg-[#2563EB] px-6 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1">
              Bắt đầu làm quiz
              <PlayCircle className="h-5 w-5" />
            </Link>
            <Link to={`/quiz/${quiz.id}/take`} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-6 py-4 font-black text-[#2563EB] shadow-md transition hover:-translate-y-1">
              Làm lại
              <RotateCcw className="h-5 w-5" />
            </Link>
          </div>
        </Card>

        <Card>
          <SectionTitle icon={ListChecks} title="Quy định làm bài" />
          <div className="mt-5 space-y-3">
            {quiz.rules.map((rule) => (
              <div key={rule} className="flex gap-3 rounded-3xl bg-blue-50 p-4 font-bold text-slate-600">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <SectionTitle icon={Target} title="Nội dung ôn tập" />
          <div className="mt-5 flex flex-wrap gap-3">
            {quiz.topics.map((topic) => (
              <span key={topic} className="rounded-3xl bg-orange-50 px-4 py-3 font-black text-[#F97316]">
                {topic}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={Trophy} title="Lịch sử làm bài" />
          <div className="mt-5 space-y-3">
            {history.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-4 font-bold text-slate-500">Chưa có lượt làm nào.</div>
            ) : history.map((attempt) => (
              <div key={`${attempt.date}-${attempt.score}-${attempt.status}`} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-black text-slate-900">{attempt.date}</p>
                  <p className="text-sm font-bold text-slate-500">
                    {attempt.status}{attempt.correct !== undefined ? ` - Đúng ${attempt.correct}/${attempt.total}` : ''}
                  </p>
                </div>
                <span className="rounded-3xl bg-green-50 px-4 py-2 font-black text-[#22C55E]">{attempt.score}/10</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* <Card>
        <SectionTitle icon={Clock3} title="Câu hỏi mẫu" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quiz.questionPreview.map((question, index) => (
            <div key={question.prompt} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-3xl bg-orange-50 font-black text-[#F97316]">{index + 1}</span>
                <span className="rounded-3xl bg-blue-50 px-3 py-1 text-sm font-black text-[#2563EB]">{question.points}đ</span>
              </div>
              <p className="mt-4 text-sm font-black uppercase text-slate-400">{question.type}</p>
              <h3 className="mt-1 font-black text-slate-900">{question.prompt}</h3>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
}

function getBestScore(history, fallbackScore) {
  const scores = history
    .map((attempt) => normalizeScore(attempt.score))
    .filter((score) => !Number.isNaN(score));

  if (scores.length === 0) {
    return fallbackScore;
  }

  return formatScore(Math.max(...scores));
}

function normalizeScore(score) {
  const numericScore = Number.parseFloat(score);

  if (String(score).includes('%')) {
    return numericScore / 10;
  }

  return numericScore;
}

function formatScore(score) {
  return Number.isInteger(score) ? `${score}` : score.toFixed(1);
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <Icon className="h-6 w-6 text-[#2563EB]" />
      <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default QuizDetail;
