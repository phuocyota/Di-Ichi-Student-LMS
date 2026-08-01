import { Award, Medal, Trophy } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/common/Card.jsx';
import MiniMetric from '../components/common/MiniMetric.jsx';
import PageShell from '../components/common/PageShell.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { achievements, colors, student } from '../datas/lmsData.js';

function AchievementsPage() {
  return (
    <PageShell title="Thành tích" subtitle="Gamification giúp học sinh thấy rõ nỗ lực mỗi ngày.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <BadgePanel />
        <LeaderboardPanel />
      </div>
    </PageShell>
  );
}

function BadgePanel() {
  return (
    <Card>
      <SectionTitle icon={Trophy} title="Huy hiệu & XP" />
      <div className="mt-5 grid grid-cols-2 gap-4">
        {achievements.earnedBadges.map((badge) => (
          <BadgeTile key={badge} badge={badge} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <MiniMetric label="XP" value={student.xp} />
        <MiniMetric label="Level" value={student.level} />
        <MiniMetric label="Streak" value={`${student.streak}`} />
      </div>
    </Card>
  );
}

function LeaderboardPanel() {
  return (
    <Card>
      <SectionTitle icon={Award} title="Top học viên" />
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={achievements.leaderboard} layout="vertical">
            <CartesianGrid strokeDasharray="4 4" stroke="#FED7AA" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontWeight: 800 }} />
            <Tooltip />
            <Bar dataKey="xp" radius={[0, 16, 16, 0]} fill={colors.orange} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-3xl bg-green-50 p-4 font-black text-[#22C55E]">
        Chuỗi học liên tiếp: {student.streak} ngày - mốc tiếp theo ở ngày 10.
      </div>
    </Card>
  );
}

function BadgeTile({ badge }) {
  return (
    <div className="rounded-3xl bg-[#FFF7ED] p-4 text-center">
      <Medal className="mx-auto h-12 w-12 text-[#F97316]" />
      <h3 className="mt-3 font-black">{badge}</h3>
    </div>
  );
}

export default AchievementsPage;
