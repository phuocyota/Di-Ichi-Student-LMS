import { Award } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { getAchievementSummary, getLeaderboard } from '../../datas/achievementData.js';
import { colors } from '../../datas/lmsData.js';

function LeaderboardPanel() {
  const leaderboard = getLeaderboard();
  const summary = getAchievementSummary();

  return (
    <Card>
      <SectionTitle icon={Award} title="Top học viên" />
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leaderboard} layout="vertical">
            <CartesianGrid strokeDasharray="4 4" stroke="#FED7AA" />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontWeight: 800 }} />
            <Tooltip />
            <Bar dataKey="xp" radius={[0, 16, 16, 0]} fill={colors.orange} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-3xl bg-green-50 p-4 font-black text-[#22C55E]">
        Chuỗi học liên tiếp: {summary.streak} ngày - mốc tiếp theo ở ngày 10.
      </div>
    </Card>
  );
}

export default LeaderboardPanel;
