import { NavLink } from 'react-router-dom';
import { Bell, Flame, Search, Star } from 'lucide-react';
import { student } from '../../datas/lmsData.js';

function Header() {
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
            <HeaderPill icon={Star} text={`${student.xp} XP`} color="text-amber-500" />
            <button aria-label="Thông báo" className="relative rounded-3xl bg-white p-3 shadow-md shadow-orange-100 transition hover:-translate-y-0.5 hover:shadow-lg">
              <Bell className="h-6 w-6 text-slate-700" />
              <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-white bg-[#EF4444]" />
            </button>
          </div>
        </div>
        <label className="flex items-center gap-3 rounded-3xl bg-white px-5 py-3 shadow-md shadow-orange-100">
          <Search className="h-5 w-5 text-orange-500" />
          <input className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-slate-400" placeholder="Tìm khóa học, bài học, tài liệu..." />
        </label>
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

export default Header;
