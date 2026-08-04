import { certificates } from './certificateData.js';
import { courses } from './courseData.js';
import { homework } from './homeworkData.js';
import { student } from './lmsData.js';
import { quizzes } from './quizData.js';

export function getAchievementSummary() {
  const earnedBadges = getEarnedBadges();
  const totalXp = student.xp + earnedBadges.reduce((sum, badge) => sum + badge.xp, 0);

  return {
    earnedBadges,
    totalXp,
    level: student.level,
    streak: student.streak,
    certificates: certificates.length,
    completedCourses: courses.filter((course) => course.progress >= 80).length,
  };
}

export function getEarnedBadges() {
  const highScoreQuizCount = quizzes.filter((quiz) => parseScore(quiz.bestScore) >= 8.5).length;
  const gradedHomeworkCount = homework.filter((item) => item.status === 'Đã chấm').length;
  const submittedHomeworkCount = homework.filter((item) => ['Đã nộp', 'Đã chấm'].includes(item.status)).length;
  const almostCompletedCourse = courses.some((course) => course.progress >= 80);

  return [
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: `Đạt điểm cao ở ${highScoreQuizCount}/${quizzes.length} quiz.`,
      progress: Math.round((highScoreQuizCount / quizzes.length) * 100),
      xp: highScoreQuizCount * 120,
      earned: highScoreQuizCount >= 2,
      tone: 'blue',
    },
    {
      id: 'homework-finisher',
      title: 'Homework Finisher',
      description: `Đã nộp hoặc hoàn thành ${submittedHomeworkCount}/${homework.length} bài tập.`,
      progress: Math.round((submittedHomeworkCount / homework.length) * 100),
      xp: submittedHomeworkCount * 60,
      earned: submittedHomeworkCount >= 4,
      tone: 'orange',
    },
    {
      id: 'feedback-collector',
      title: 'Feedback Collector',
      description: `Có ${gradedHomeworkCount} bài tập đã được giáo viên chấm.`,
      progress: Math.min(100, gradedHomeworkCount * 50),
      xp: gradedHomeworkCount * 80,
      earned: gradedHomeworkCount >= 2,
      tone: 'green',
    },
    {
      id: 'certificate-hunter',
      title: 'Certificate Hunter',
      description: `Sở hữu ${certificates.length} chứng chỉ trong hồ sơ học tập.`,
      progress: Math.min(100, Math.round((certificates.length / 3) * 100)),
      xp: certificates.length * 150,
      earned: certificates.length >= 3,
      tone: 'yellow',
    },
    {
      id: 'streak-keeper',
      title: '9-Day Streak',
      description: `Duy trì chuỗi học ${student.streak} ngày liên tiếp.`,
      progress: Math.min(100, Math.round((student.streak / 10) * 100)),
      xp: student.streak * 40,
      earned: student.streak >= 7,
      tone: 'red',
    },
    {
      id: 'course-sprinter',
      title: 'Course Sprinter',
      description: almostCompletedCourse ? 'Có khóa học đạt trên 80% tiến độ.' : 'Hoàn thành 80% một khóa học để mở huy hiệu.',
      progress: Math.max(...courses.map((course) => course.progress)),
      xp: almostCompletedCourse ? 220 : 0,
      earned: almostCompletedCourse,
      tone: 'purple',
    },
  ];
}

export function getLeaderboard() {
  const summary = getAchievementSummary();

  return [
    { name: student.name, xp: summary.totalXp },
    { name: 'Gia Huy', xp: 2320 },
    { name: 'Bảo Ngọc', xp: 2180 },
    { name: 'Tuấn Kiệt', xp: 2090 },
  ].sort((a, b) => b.xp - a.xp);
}

export function getRecentAchievements() {
  return getEarnedBadges()
    .filter((badge) => badge.earned)
    .slice(0, 4)
    .map((badge) => ({
      title: badge.title,
      description: badge.description,
      xp: badge.xp,
    }));
}

function parseScore(score) {
  const parsedScore = Number.parseFloat(score);
  return Number.isNaN(parsedScore) ? 0 : parsedScore;
}
