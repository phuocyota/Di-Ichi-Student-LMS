import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, Send } from 'lucide-react';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import { saveQuizAttempt } from '../../utils/quizAttempts.js';

function QuizTaking({ quiz }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [activeQuestionId, setActiveQuestionId] = useState(quiz.examQuestions[0]?.id);
  const [timeLeft, setTimeLeft] = useState(getDurationSeconds(quiz.duration));

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / quiz.examQuestions.length) * 100);
  const activeQuestion = quiz.examQuestions.find((question) => question.id === activeQuestionId) ?? quiz.examQuestions[0];

  const score = useMemo(() => {
    const correctCount = quiz.examQuestions.filter((question) => answers[question.id] === question.answer).length;
    return formatScore(calculateScore(correctCount, quiz.examQuestions.length));
  }, [answers, quiz.examQuestions]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  function handleAnswer(questionId, option) {
    setAnswers((current) => ({
      ...current,
      [questionId]: option,
    }));
  }

  function handleSubmit() {
    const correctCount = quiz.examQuestions.filter((question) => answers[question.id] === question.answer).length;
    const nextScore = formatScore(calculateScore(correctCount, quiz.examQuestions.length));
    const attempt = {
      date: new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      score: nextScore,
      correct: correctCount,
      total: quiz.examQuestions.length,
      status: 'Vừa nộp',
    };

    saveQuizAttempt(quiz.id, attempt);
    navigate(`/quiz/${quiz.id}`, { state: { submittedScore: attempt.score } });
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(`/quiz/${quiz.id}`)} className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:text-[#F97316]">
        <ArrowLeft className="h-4 w-4" />
        Quay lại chi tiết quiz
      </button>

      <section className="grid gap-6 xl:grid-cols-[17rem_1fr_18rem]">
        <Card className="h-fit xl:sticky xl:top-5">
          <p className="text-sm font-black uppercase text-[#F97316]">TOEIC practice mode</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">{quiz.title}</h2>
          <div className="mt-5 grid grid-cols-5 gap-2 xl:grid-cols-4">
            {quiz.examQuestions.map((question, index) => {
              const answered = Boolean(answers[question.id]);
              const active = question.id === activeQuestion.id;
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setActiveQuestionId(question.id)}
                  className={`grid h-11 place-items-center rounded-3xl font-black ${active ? 'bg-[#2563EB] text-white' : answered ? 'bg-green-50 text-[#22C55E]' : 'bg-slate-100 text-slate-500'}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 border-b border-orange-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#2563EB]">Question {quiz.examQuestions.indexOf(activeQuestion) + 1} of {quiz.examQuestions.length}</p>
              <h3 className="mt-2 text-2xl font-black leading-snug text-slate-900">{activeQuestion.prompt}</h3>
            </div>
            <span className="rounded-3xl bg-orange-50 px-4 py-2 font-black text-[#F97316]">1 điểm</span>
          </div>

          <div className="mt-6 space-y-3">
            {activeQuestion.options.map((option, index) => {
              const selected = answers[activeQuestion.id] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(activeQuestion.id, option)}
                  className={`flex w-full items-center gap-4 rounded-3xl p-4 text-left font-bold transition ${selected ? 'bg-blue-50 ring-2 ring-[#2563EB]' : 'bg-slate-50 hover:bg-orange-50'}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-3xl font-black ${selected ? 'bg-[#2563EB] text-white' : 'bg-white text-slate-500'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-slate-700">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => moveQuestion(-1, quiz.examQuestions, activeQuestion.id, setActiveQuestionId)} className="rounded-3xl bg-slate-100 px-5 py-3 font-black text-slate-600">
              Câu trước
            </button>
            <button type="button" onClick={() => moveQuestion(1, quiz.examQuestions, activeQuestion.id, setActiveQuestionId)} className="rounded-3xl bg-[#2563EB] px-5 py-3 font-black text-white shadow-lg shadow-blue-200">
              Câu tiếp theo
            </button>
          </div>
        </Card>

        <Card className="h-fit xl:sticky xl:top-5">
          <div className="flex items-center gap-3 rounded-3xl bg-blue-50 p-4">
            <Clock3 className="h-7 w-7 text-[#2563EB]" />
            <div>
              <p className="text-xs font-black uppercase text-slate-400">Thời gian còn lại</p>
              <p className="text-2xl font-black text-slate-900">{formatTime(timeLeft)}</p>
            </div>
          </div>
          <ProgressBar value={progress} label={`Đã trả lời ${answeredCount}/${quiz.examQuestions.length} câu`} />
          <div className="mt-5 rounded-3xl bg-orange-50 p-4">
            <p className="text-xs font-black uppercase text-[#F97316]">Điểm tạm tính</p>
            <p className="mt-1 text-3xl font-black text-slate-900">{score}/10</p>
          </div>
          <button type="button" onClick={handleSubmit} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200">
            Nộp bài
            <Send className="h-5 w-5" />
          </button>
          <div className="mt-4 flex items-start gap-2 rounded-3xl bg-green-50 p-4 text-sm font-bold text-[#22C55E]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Sau khi nộp, điểm sẽ được lưu vào lịch sử của quiz này.</span>
          </div>
        </Card>
      </section>
    </div>
  );
}

function moveQuestion(direction, questions, activeQuestionId, setActiveQuestionId) {
  const currentIndex = questions.findIndex((question) => question.id === activeQuestionId);
  const nextIndex = Math.min(Math.max(currentIndex + direction, 0), questions.length - 1);
  setActiveQuestionId(questions[nextIndex].id);
}

function getDurationSeconds(duration) {
  const minutes = Number.parseInt(duration, 10);
  return Number.isNaN(minutes) ? 600 : minutes * 60;
}

function calculateScore(correctCount, totalQuestions) {
  return (correctCount / totalQuestions) * 10;
}

function formatScore(score) {
  return Number.isInteger(score) ? `${score}` : score.toFixed(1);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

export default QuizTaking;
