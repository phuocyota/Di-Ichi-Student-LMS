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

export const courses = [
  {
    title: 'Explorer English A2',
    teacher: 'Ms. Jenny',
    progress: 68,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80',
    tag: 'Đang học',
    nextLesson: 'Past Simple Story',
  },
  {
    title: 'Teen IELTS Foundation',
    teacher: 'Mr. Daniel',
    progress: 42,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80',
    tag: 'Mới mở',
    nextLesson: 'Listening Mini Test',
  },
  {
    title: 'Speaking Club Junior',
    teacher: 'Ms. Anna',
    progress: 83,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=80',
    tag: 'Sắp hoàn thành',
    nextLesson: 'Show and Tell',
  },
];

export const timeline = [
  { time: '08:30', title: 'Grammar: Past Simple', teacher: 'Ms. Jenny', type: 'Phòng 204' },
  { time: '14:00', title: 'Speaking Practice', teacher: 'Mr. Daniel', type: 'Online' },
  { time: '19:30', title: 'Quiz ôn tập Unit 6', teacher: 'Di-Ichi App', type: '15 phút' },
];

export const homework = [
  { title: 'Write about your weekend', due: 'Hôm nay, 20:00', status: 'Cần nộp', score: '--', color: 'orange' },
  { title: 'Workbook Unit 6', due: 'Ngày mai, 18:00', status: 'Đang làm', score: '8.5', color: 'green' },
  { title: 'Listening worksheet', due: 'Thứ sáu, 21:00', status: 'Chưa mở', score: '--', color: 'blue' },
];

export const quizzes = [
  { title: 'Vocabulary Sprint', questions: 20, duration: '15 phút', score: '92%', start: 'Sẵn sàng' },
  { title: 'Grammar Checkpoint', questions: 15, duration: '12 phút', score: 'Chưa có', start: 'Mở lúc 19:30' },
  { title: 'Listening Mini Test', questions: 10, duration: '10 phút', score: '88%', start: 'Làm lại' },
];

export const onlineClasses = [
  { time: '14:00 hôm nay', teacher: 'Mr. Daniel', className: 'Speaking Club Junior', room: 'Zoom Room A' },
  { time: '19:30 ngày mai', teacher: 'Ms. Jenny', className: 'Grammar Clinic', room: 'Google Meet' },
];

export const materials = [
  { type: 'PDF', title: 'Unit 6 Vocabulary', icon: 'FileText', color: 'text-[#EF4444]' },
  { type: 'Video', title: 'Speaking Examples', icon: 'Video', color: 'text-[#2563EB]' },
  { type: 'Audio', title: 'Listening Track 06', icon: 'FileAudio', color: 'text-[#22C55E]' },
  { type: 'Slide', title: 'Grammar Recap', icon: 'BookOpen', color: 'text-[#F59E0B]' },
  { type: 'Word', title: 'Writing Template', icon: 'FileText', color: 'text-[#F97316]' },
  { type: 'Audio', title: 'Pronunciation Drill', icon: 'Headphones', color: 'text-[#2563EB]' },
];

export const progressData = [
  { week: 'T1', score: 62, xp: 420 },
  { week: 'T2', score: 70, xp: 680 },
  { week: 'T3', score: 73, xp: 820 },
  { week: 'T4', score: 78, xp: 980 },
  { week: 'T5', score: 84, xp: 1240 },
  { week: 'T6', score: 88, xp: 1560 },
];

export const lessons = [
  { chapter: 'Chapter 1: My World', items: ['Hello Friends', 'My Family', 'My School Bag'] },
  { chapter: 'Chapter 2: Adventures', items: ['Past Simple Story', 'Amazing Places', 'Show and Tell'] },
  { chapter: 'Chapter 3: Future Me', items: ['Dream Jobs', 'Going To', 'Project Day'] },
];

export const certificates = [
  { title: 'A2 Explorer Certificate', date: '12/07/2026', score: 'Excellent' },
  { title: 'Speaking Star Award', date: '26/06/2026', score: 'Top 10%' },
];

export const achievements = {
  badges: ['Speed Reader', 'Quiz Master', '9-Day Streak', 'Speaking Star'],
  earnedBadges: ['Quiz Master', 'Speaking Star', 'Fast Finisher', 'Kind Helper'],
  leaderboard: [
    { name: 'Minh Anh', xp: 2480 },
    { name: 'Gia Huy', xp: 2320 },
    { name: 'Bảo Ngọc', xp: 2180 },
    { name: 'Tuấn Kiệt', xp: 2090 },
  ],
};
