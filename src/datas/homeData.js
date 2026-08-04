import { getAchievementSummary, getEarnedBadges } from './achievementData.js';
import { courses } from './courseData.js';
import { homework } from './homeworkData.js';
import { quizzes } from './quizData.js';

export function getFeaturedCourse() {
  return courses
    .filter((course) => course.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0] ?? courses[0];
}

export function getHomeStudentStats() {
  const achievementSummary = getAchievementSummary();
  const nextLevelXp = (achievementSummary.level + 1) * 240;
  const currentLevelXp = achievementSummary.level * 240;
  const levelProgress = Math.min(100, Math.round(((achievementSummary.totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return {
    xp: achievementSummary.totalXp,
    level: achievementSummary.level,
    streak: achievementSummary.streak,
    nextLevelXp,
    xpToNextLevel: Math.max(0, nextLevelXp - achievementSummary.totalXp),
    levelProgress,
  };
}

export function getPriorityHomework() {
  return homework.find((item) => item.status === 'Cần nộp')
    ?? homework.find((item) => item.status === 'Đang làm')
    ?? homework[0];
}

export function getPriorityQuiz() {
  return quizzes.find((quiz) => quiz.score === 'Chưa có')
    ?? quizzes.find((quiz) => quiz.start === 'Sẵn sàng')
    ?? quizzes[0];
}

export function getHighlightedBadges() {
  return getEarnedBadges().filter((badge) => badge.earned).slice(0, 4);
}
