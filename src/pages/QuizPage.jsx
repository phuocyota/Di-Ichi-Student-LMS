import { Navigate, useLocation, useParams } from 'react-router-dom';
import QuizDetail from '../components/QuizPage/QuizDetail.jsx';
import QuizGrid from '../components/QuizPage/QuizGrid.jsx';
import QuizTaking from '../components/QuizPage/QuizTaking.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { quizzes } from '../datas/quizData.js';

function QuizPage() {
  const { quizId } = useParams();
  const location = useLocation();
  const selectedQuiz = quizId ? quizzes.find((quiz) => quiz.id === quizId) : null;
  const takingQuiz = Boolean(selectedQuiz && location.pathname.endsWith('/take'));

  if (quizId && !selectedQuiz) {
    return <Navigate to="/quiz" replace />;
  }

  if (takingQuiz) {
    return <QuizTaking quiz={selectedQuiz} />;
  }

  if (selectedQuiz) {
    return <QuizDetail quiz={selectedQuiz} />;
  }

  return (
    <PageShell title="Quiz" subtitle="Luyện nhanh, xem điểm và mở khóa huy hiệu mới.">
      <QuizGrid />
    </PageShell>
  );
}

export default QuizPage;
