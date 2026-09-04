export const colors = {
  orange: '#F97316',
  orangeLight: '#FDBA74',
  orangeBackground: '#FFF7ED',
  secondary: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const student = {
  name: 'Minh Anh',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&q=80',
  xp: 2480,
  level: 12,
  streak: 9,
};

export const menuItems = [
  { path: '/', label: 'Trang chủ', icon: 'Home', color: 'from-orange-400 to-orange-600' },
  { path: '/courses', label: 'Khóa học', icon: 'BookOpen', color: 'from-blue-400 to-blue-600' },
  { path: '/lessons', label: 'Học bài', icon: 'CirclePlay', color: 'from-green-400 to-emerald-600' },
  { path: '/homework', label: 'Homework', icon: 'FileText', color: 'from-amber-400 to-orange-500' },
  { path: '/quiz', label: 'Quiz', icon: 'BadgeCheck', color: 'from-sky-400 to-blue-600' },
  { path: '/online', label: 'Lớp học Online', icon: 'Laptop', color: 'from-violet-400 to-indigo-600' },
  { path: '/materials', label: 'Tài liệu', icon: 'GraduationCap', color: 'from-rose-400 to-pink-600' },
  { path: '/progress', label: 'Tiến độ', icon: 'Target', color: 'from-teal-400 to-cyan-600' },
  { path: '/certificates', label: 'Chứng chỉ', icon: 'Award', color: 'from-yellow-400 to-amber-500' },
  { path: '/achievements', label: 'Thành tích', icon: 'Trophy', color: 'from-fuchsia-400 to-purple-600' },
];

export const bottomNav = [
  { path: '/', label: 'Home', icon: 'Home' },
  { path: '/courses', label: 'Khóa học', icon: 'BookOpen' },
  { path: '/lessons', label: 'Học bài', icon: 'Play' },
  { path: '/homework', label: 'Bài tập', icon: 'FileText' },
  { path: '/achievements', label: 'XP', icon: 'Trophy' },
];

export { courses } from './courseData.js';

export const timeline = [
  { time: '08:30', title: 'Grammar: Past Simple', teacher: 'Ms. Jenny', type: 'Phòng 204' },
  { time: '14:00', title: 'Speaking Practice', teacher: 'Mr. Daniel', type: 'Online' },
  { time: '19:30', title: 'Quiz ôn tập Unit 6', teacher: 'Di-Ichi App', type: '15 phút' },
];

export { homework } from './homeworkData.js';

export { quizzes } from './quizData.js';

export const onlineClasses = [
  { time: '14:00 hôm nay', teacher: 'Mr. Daniel', className: 'Speaking Club Junior', room: 'Zoom Room A' },
  { time: '19:30 ngày mai', teacher: 'Ms. Jenny', className: 'Grammar Clinic', room: 'Google Meet' },
];

export { materials } from './materialsData.js';

export { lessons } from './lessonData.js';

export { certificates } from './certificateData.js';
