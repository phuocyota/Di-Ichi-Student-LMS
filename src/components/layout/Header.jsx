import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Flame, Search, Star } from 'lucide-react';
import { student } from '../../datas/lmsData.js';
import { certificates } from '../../datas/certificateData.js';
import { courses } from '../../datas/courseData.js';
import { getHomeStudentStats } from '../../datas/homeData.js';
import { homework } from '../../datas/homeworkData.js';
import { materialLessons } from '../../datas/materialsData.js';
import { notifications } from '../../datas/notificationData.js';
import { quizzes } from '../../datas/quizData.js';
import NotificationDropdown from './NotificationDropdown.jsx';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const stats = getHomeStudentStats();
  const searchResults = useMemo(() => getSearchResults(searchTerm), [searchTerm]);
  const unreadCount = notifications.filter((notification) => notification.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-[#FFF8F2]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <img src={student.avatar} alt="Avatar học sinh" className="h-14 w-14 rounded-3xl object-cover shadow-md shadow-orange-200" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-orange-500">Xin chào,</p>
              <h1 className="truncate text-2xl font-black text-slate-900">{student.name}</h1>
            </div>
          </NavLink>
          <div className="flex items-center gap-2">
            <HeaderPill icon={Flame} text={`${student.streak} ngày`} color="text-orange-600" />
            <HeaderPill icon={Star} text={`${stats.xp} XP`} color="text-amber-500" />
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                aria-label="Thông báo"
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative rounded-3xl bg-orange-50 p-3 text-[#F97316] shadow-md shadow-orange-100 ring-1 ring-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-100 hover:shadow-lg"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-3xl border-2 border-white bg-[#F97316] px-1 text-xs font-black text-white shadow-md shadow-orange-200">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
              <NotificationDropdown open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
            </div>
          </div>
        </div>
        <div className="relative">
          <label className="flex items-center gap-3 rounded-3xl bg-white px-5 py-3 shadow-md shadow-orange-100">
            <Search className="h-5 w-5 text-orange-500" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-slate-400"
              placeholder="Tìm khóa học, bài học, tài liệu..."
            />
          </label>
          {searchResults.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-3xl bg-white p-3 shadow-xl shadow-orange-100">
              <div className="grid gap-2">
                {searchResults.map((item) => (
                  <NavLink key={`${item.type}-${item.title}`} to={item.path} onClick={() => setSearchTerm('')} className="rounded-3xl bg-orange-50 px-4 py-3 transition hover:bg-orange-100">
                    <p className="text-xs font-black uppercase text-[#F97316]">{item.type}</p>
                    <p className="mt-1 font-black text-slate-900">{item.title}</p>
                    <p className="text-sm font-bold text-slate-500">{item.subtitle}</p>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeaderPill({ icon: Icon, text, color }) {
  return (
    <div className="hidden items-center gap-2 rounded-3xl bg-white px-4 py-3 font-extrabold shadow-md shadow-orange-100 sm:flex">
      <Icon className={`h-5 w-5 ${color}`} />
      <span>{text}</span>
    </div>
  );
}

function getSearchResults(searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return [];
  }

  return [
    ...courses.map((course) => ({
      type: 'Khóa học',
      title: course.title,
      subtitle: course.teacher,
      path: `/courses/${course.id}`,
    })),
    ...homework.map((item) => ({
      type: 'Homework',
      title: item.title,
      subtitle: `${item.course} - ${item.status}`,
      path: '/homework',
    })),
    ...quizzes.map((quiz) => ({
      type: 'Quiz',
      title: quiz.title,
      subtitle: `${quiz.course} - ${quiz.start}`,
      path: `/quiz/${quiz.id}`,
    })),
    ...materialLessons.map((lesson) => ({
      type: 'Tài liệu',
      title: lesson.title,
      subtitle: lesson.course,
      path: '/materials',
    })),
    ...certificates.map((certificate) => ({
      type: 'Chứng chỉ',
      title: certificate.title,
      subtitle: certificate.course,
      path: '/certificates',
    })),
  ]
    .filter((item) => [item.title, item.subtitle, item.type].some((value) => value.toLowerCase().includes(normalizedSearch)))
    .slice(0, 6);
}

export default Header;
