import QuizCard from './QuizCard.jsx';
import { quizzes } from '../../datas/quizData.js';

function QuizGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.title} quiz={quiz} />
      ))}
    </div>
  );
}

export default QuizGrid;
