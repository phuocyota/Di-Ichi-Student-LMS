import { motion } from 'framer-motion';
import { BadgeCheck, CalendarClock, ChevronRight, FileText, Flame, Medal, Sparkles, Star, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import DueCard from '../components/cards/DueCard.jsx';
import Card from '../components/common/Card.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { iconMap } from '../components/icons/iconMap.jsx';
import { achievements, courses, menuItems, student, timeline } from '../datas/lmsData.js';

function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <MenuGrid />
      <LearningOverview />
      <TodayAndAchievements />
    </div>
  );
}

function HeroBanner() {
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
            <p className="mt-3 max-w-xl text-base font-semibold text-white/90 sm:text-lg">Hoàn thành bài học, nhận XP, giữ streak và mở khóa huy hiệu mới.</p>
          </div>
          <button className="rounded-3xl bg-white px-6 py-4 text-lg font-black text-[#F97316] shadow-lg transition hover:-translate-y-1">
            Bắt đầu học ngay
          </button>
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

function MenuGrid() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {menuItems.map((item, index) => {
        const Icon = iconMap[item.icon];
        return (
          <motion.div key={item.path} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
            <NavLink to={item.path} className="group flex h-full flex-col gap-4 rounded-3xl bg-white p-4 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="text-lg font-black text-slate-900 group-hover:text-[#F97316]">{item.label}</span>
            </NavLink>
          </motion.div>
        );
      })}
    </section>
  );
}

function LearningOverview() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Card className="grid gap-5 md:grid-cols-[12rem_1fr]">
        <img className="h-48 w-full rounded-3xl object-cover md:h-full" src={courses[0].image} alt={courses[0].title} />
        <div className="flex flex-col justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">Tiếp tục học</p>
            <h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{courses[0].title}</h3>
            <p className="mt-2 font-bold text-slate-500">Bài tiếp theo: {courses[0].nextLesson}</p>
          </div>
          <ProgressBar value={courses[0].progress} />
          <button className="inline-flex w-fit items-center gap-2 rounded-3xl bg-[#F97316] px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1">
            Tiếp tục <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>
      <Card className="bg-[#FFF7ED]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">Điểm thưởng</p>
            <h3 className="text-3xl font-black">{student.xp} XP</h3>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#F97316] text-white shadow-lg shadow-orange-200">
            <Flame className="h-9 w-9" />
          </div>
        </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <Star className="h-7 w-7 text-[#F97316]" />
            <p className="mt-2 text-sm font-bold text-slate-400">Level</p>
            <p className="text-2xl font-black text-slate-900">{student.level}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <Flame className="h-7 w-7 text-[#F97316]" />
            <p className="mt-2 text-sm font-bold text-slate-400">Streak</p>
            <p className="text-2xl font-black text-slate-900">{student.streak} ngày</p>
          </div>
        </div>
        <ProgressBar value={76} label="Còn 320 XP để lên Level 13" />
      </Card>
    </section>
  );
}

function TodayAndAchievements() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <SectionTitle icon={CalendarClock} title="Lịch học hôm nay" />
          <div className="mt-5 space-y-4">
            {timeline.map((item) => (
              <div key={item.time} className="flex gap-4">
                <div className="w-16 shrink-0 rounded-3xl bg-orange-50 py-3 text-center text-sm font-black text-[#F97316]">{item.time}</div>
                <div className="border-l-4 border-orange-200 pl-4">
                  <h4 className="font-black text-slate-900">{item.title}</h4>
                  <p className="text-sm font-bold text-slate-500">{item.teacher} - {item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <DueCard title="Homework sắp đến hạn" subtitle="Write about your weekend" icon={FileText} tone="orange" action="Nộp bài" />
        <DueCard title="Quiz sắp diễn ra" subtitle="Grammar Checkpoint - 19:30" icon={BadgeCheck} tone="blue" action="Ôn nhanh" />
      </section>
      <Card>
        <SectionTitle icon={Trophy} title="Thành tích nổi bật" />
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {achievements.badges.map((badge, index) => (
            <div key={badge} className="min-w-48 rounded-3xl bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-[#FDBA74] text-white">
                <Medal className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-lg font-black">{badge}</h4>
              <p className="text-sm font-bold text-slate-500">Mốc #{index + 1} đã mở khóa</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default HomePage;
