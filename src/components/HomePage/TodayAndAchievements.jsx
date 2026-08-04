import { BadgeCheck, CalendarClock, FileText, Medal, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import DueCard from './DueCard.jsx';
import { getHighlightedBadges, getPriorityHomework, getPriorityQuiz } from '../../datas/homeData.js';
import { timeline } from '../../datas/lmsData.js';

function TodayAndAchievements() {
  const highlightedBadges = getHighlightedBadges();
  const priorityHomework = getPriorityHomework();
  const priorityQuiz = getPriorityQuiz();

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
        <DueCard title="Homework cần xử lý" subtitle={`${priorityHomework.title} - ${priorityHomework.due}`} icon={FileText} tone="orange" action="Mở homework" to="/homework" />
        <DueCard title="Quiz cần làm" subtitle={`${priorityQuiz.title} - ${priorityQuiz.start}`} icon={BadgeCheck} tone="blue" action="Mở quiz" to={`/quiz/${priorityQuiz.id}`} />
      </section>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle icon={Trophy} title="Thành tích nổi bật" />
          <NavLink to="/achievements" className="rounded-3xl bg-orange-50 px-4 py-2 text-sm font-black text-[#F97316]">
            Xem tất cả
          </NavLink>
        </div>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {highlightedBadges.map((badge, index) => (
            <div key={badge.id} className="min-w-48 rounded-3xl bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
              <div className="grid h-14 w-14 place-items-center rounded-3xl bg-[#FDBA74] text-white">
                <Medal className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-lg font-black">{badge.title}</h4>
              <p className="text-sm font-bold text-slate-500">Mốc #{index + 1} đã mở khóa</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default TodayAndAchievements;
