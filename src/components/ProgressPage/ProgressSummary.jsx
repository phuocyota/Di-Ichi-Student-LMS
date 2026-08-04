import { Target } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import Card from '../common/Card.jsx';
import MiniMetric from '../common/MiniMetric.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { colors } from '../../datas/lmsData.js';
import { formatPercent, formatScore, getProgressSummary } from '../../datas/progressData.js';

function ProgressSummary() {
  const summary = getProgressSummary();
  const completedPercent = formatPercent(summary.averageCourseProgress);

  return (
    <Card>
      <SectionTitle icon={Target} title="Tổng quan" />
      <div className="mx-auto mt-6 h-56 max-w-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={[{ name: 'Done', value: completedPercent }, { name: 'Left', value: 100 - completedPercent }]} innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value">
              <Cell fill={colors.orange} />
              <Cell fill="#FFE8D5" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-36 mb-14 text-center">
        <p className="text-5xl font-black text-slate-900">{completedPercent}%</p>
        <p className="font-bold text-slate-500">Hoàn thành</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MiniMetric label="Điểm TB" value={formatScore(summary.averageScore)} />
        <MiniMetric label="Homework" value={summary.homeworkProgress} />
        <MiniMetric label="Quiz" value={summary.quizProgress} />
      </div>
    </Card>
  );
}

export default ProgressSummary;
