import { Sparkles } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { getAchievementSummary, getRecentAchievements } from '../../datas/achievementData.js';

function AchievementHighlights() {
  const summary = getAchievementSummary();
  const recentAchievements = getRecentAchievements();

  return (
    <Card>
      <SectionTitle icon={Sparkles} title="Thành tích nổi bật" />
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <Highlight label="Chứng chỉ" value={summary.certificates} />
        <Highlight label="Khóa gần hoàn thành" value={summary.completedCourses} />
        <Highlight label="Huy hiệu đã mở" value={summary.earnedBadges.filter((badge) => badge.earned).length} />
        <Highlight label="Tổng XP" value={summary.totalXp} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {recentAchievements.map((item) => (
          <div key={item.title} className="rounded-3xl bg-orange-50 p-4">
            <h3 className="font-black text-slate-900">{item.title}</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{item.description}</p>
            <p className="mt-2 font-black text-[#F97316]">+{item.xp} XP</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Highlight({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4 text-center">
      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-black uppercase text-slate-400">{label}</p>
    </div>
  );
}

export default AchievementHighlights;
