import { Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getFeaturedCourse } from '../../datas/homeData.js';

function HeroBanner() {
  const featuredCourse = getFeaturedCourse();

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#F97316] via-[#FDBA74] to-[#2563EB] p-6 text-white shadow-xl shadow-orange-200 sm:p-8">
      <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-3xl bg-white/20 px-4 py-2 text-sm font-black backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Di-Ichi English Center
          </div>
          <div>
            <h2 className="text-3xl font-black leading-tight sm:text-5xl">Học tiếng Anh vui hơn mỗi ngày</h2>
            <p className="mt-3 max-w-xl text-base font-semibold text-white/90 sm:text-lg">Tiếp tục {featuredCourse.title}, hoàn thành bài tập và mở khóa thành tích mới.</p>
          </div>
          <NavLink to={`/courses/${featuredCourse.id}`} className="inline-flex rounded-3xl bg-white px-6 py-4 text-lg font-black text-[#F97316] shadow-lg transition hover:-translate-y-1">
            Bắt đầu học ngay
          </NavLink>
        </div>
        <div className="relative min-h-56 sm:min-h-64">
          <img
            className="absolute inset-0 h-full w-full rounded-3xl object-cover shadow-2xl"
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
            alt="Học sinh học online"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
