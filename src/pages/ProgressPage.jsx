import { Sparkles, Target } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '../components/common/Card.jsx';
import MiniMetric from '../components/common/MiniMetric.jsx';
import PageShell from '../components/common/PageShell.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { colors, progressData } from '../datas/lmsData.js';

function ProgressPage() {
  return (
    <PageShell title="Tiến độ học tập" subtitle="Theo dõi điểm, homework, quiz và biểu đồ tiến bộ.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <ProgressSummary />
        <ProgressChart />
      </div>
    </PageShell>
  );
}

function ProgressSummary() {
  return (
    <Card>
      <SectionTitle icon={Target} title="Tổng quan" />
      <div className="mx-auto mt-6 h-56 max-w-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={[{ name: 'Done', value: 78 }, { name: 'Left', value: 22 }]} innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value">
              <Cell fill={colors.orange} />
              <Cell fill="#FFE8D5" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-36 mb-14 text-center">
        <p className="text-5xl font-black text-slate-900">78%</p>
        <p className="font-bold text-slate-500">Hoàn thành</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MiniMetric label="Điểm TB" value="8.7" />
        <MiniMetric label="Homework" value="12/15" />
        <MiniMetric label="Quiz" value="9/10" />
      </div>
    </Card>
  );
}

function ProgressChart() {
  return (
    <Card>
      <SectionTitle icon={Sparkles} title="Biểu đồ tiến độ" />
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={progressData}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.orange} stopOpacity={0.45} />
                <stop offset="95%" stopColor={colors.orange} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#FED7AA" />
            <XAxis dataKey="week" tick={{ fontWeight: 800 }} />
            <YAxis tick={{ fontWeight: 800 }} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke={colors.orange} fill="url(#scoreFill)" strokeWidth={4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ProgressPage;
