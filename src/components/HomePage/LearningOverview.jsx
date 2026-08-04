import { ChevronRight, Flame, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import { getFeaturedCourse, getHomeStudentStats } from '../../datas/homeData.js';

function LearningOverview() {
  const featuredCourse = getFeaturedCourse();
  const stats = getHomeStudentStats();

  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Card className="grid gap-5 md:grid-cols-[12rem_1fr]">
        <img className="h-48 w-full rounded-3xl object-cover md:h-full" src={featuredCourse.image} alt={featuredCourse.title} />
        <div className="flex flex-col justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">Tiếp tục học</p>
            <h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{featuredCourse.title}</h3>
            <p className="mt-2 font-bold text-slate-500">Bài tiếp theo: {featuredCourse.nextLesson}</p>
          </div>
          <ProgressBar value={featuredCourse.progress} />
          <NavLink to={`/courses/${featuredCourse.id}`} className="inline-flex w-fit items-center gap-2 rounded-3xl bg-[#F97316] px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1">
            Tiếp tục <ChevronRight className="h-5 w-5" />
          </NavLink>
        </div>
      </Card>
      <Card className="bg-[#FFF7ED]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">Điểm thưởng</p>
            <h3 className="text-3xl font-black">{stats.xp} XP</h3>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#F97316] text-white shadow-lg shadow-orange-200">
            <Flame className="h-9 w-9" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <Star className="h-7 w-7 text-[#F97316]" />
            <p className="mt-2 text-sm font-bold text-slate-400">Level</p>
            <p className="text-2xl font-black text-slate-900">{stats.level}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <Flame className="h-7 w-7 text-[#F97316]" />
            <p className="mt-2 text-sm font-bold text-slate-400">Streak</p>
            <p className="text-2xl font-black text-slate-900">{stats.streak} ngày</p>
          </div>
        </div>
        <ProgressBar value={stats.levelProgress} label={`Còn ${stats.xpToNextLevel} XP để lên Level ${stats.level + 1}`} />
      </Card>
    </section>
  );
}

export default LearningOverview;
