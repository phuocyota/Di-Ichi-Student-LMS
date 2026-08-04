import { courses } from './courseData.js';
import { homework } from './homeworkData.js';
import { quizzes } from './quizData.js';

const completedHomeworkStatuses = ['Đã nộp', 'Đã chấm'];

export function getProgressSummary() {
  const averageCourseProgress = average(courses.map((course) => course.progress));
  const submittedHomework = homework.filter((item) => completedHomeworkStatuses.includes(item.status)).length;
  const gradedHomeworkScores = homework.map((item) => parseScore(item.score)).filter(isValidScore);
  const quizScores = quizzes.map((quiz) => parseScore(quiz.bestScore)).filter(isValidScore);
  const averageHomeworkScore = average(gradedHomeworkScores);
  const averageQuizScore = average(quizScores);
  const averageScore = average([averageHomeworkScore, averageQuizScore].filter(isValidScore));

  return {
    averageCourseProgress,
    averageScore,
    homeworkProgress: `${submittedHomework}/${homework.length}`,
    quizProgress: `${quizScores.length}/${quizzes.length}`,
    submittedHomework,
    totalHomework: homework.length,
    completedQuiz: quizScores.length,
    totalQuiz: quizzes.length,
  };
}

export function getCourseProgressBreakdown() {
  return courses.map((course) => {
    const courseHomework = homework.filter((item) => item.course === course.title);
    const courseQuizzes = quizzes.filter((quiz) => quiz.course === course.title);
    const courseHomeworkScores = courseHomework.map((item) => parseScore(item.score)).filter(isValidScore);
    const courseQuizScores = courseQuizzes.map((quiz) => parseScore(quiz.bestScore)).filter(isValidScore);

    return {
      id: course.id,
      title: course.title,
      teacher: course.teacher,
      progress: course.progress,
      homework: `${courseHomework.filter((item) => completedHomeworkStatuses.includes(item.status)).length}/${courseHomework.length}`,
      quiz: `${courseQuizScores.length}/${courseQuizzes.length}`,
      score: formatScore(average([...courseHomeworkScores, ...courseQuizScores])),
    };
  });
}

export const progressTrend = [
  { week: 'T1', score: 6.2, progress: 38 },
  { week: 'T2', score: 7.0, progress: 46 },
  { week: 'T3', score: 7.3, progress: 55 },
  { week: 'T4', score: 7.8, progress: 62 },
  { week: 'T5', score: 8.4, progress: 71 },
  { week: 'T6', score: 8.8, progress: getProgressSummary().averageCourseProgress },
];

function parseScore(score) {
  const parsedScore = Number.parseFloat(score);
  return Number.isNaN(parsedScore) ? null : parsedScore;
}

function isValidScore(score) {
  return typeof score === 'number' && !Number.isNaN(score);
}

function average(values) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function formatScore(score) {
  if (!isValidScore(score)) {
    return '--';
  }

  return Number.isInteger(score) ? `${score}` : score.toFixed(1);
}

export function formatPercent(value) {
  return Math.round(value);
}
