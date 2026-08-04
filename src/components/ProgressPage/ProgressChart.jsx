import { Sparkles } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { colors } from '../../datas/lmsData.js';
import { progressTrend } from '../../datas/progressData.js';

function ProgressChart() {
  return (
    <Card>
      <SectionTitle icon={Sparkles} title="Biểu đồ tiến độ" />
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={progressTrend}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.orange} stopOpacity={0.45} />
                <stop offset="95%" stopColor={colors.orange} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.35} />
                <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#FED7AA" />
            <XAxis dataKey="week" tick={{ fontWeight: 800 }} />
            <YAxis tick={{ fontWeight: 800 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" name="Điểm TB" dataKey="score" stroke={colors.orange} fill="url(#scoreFill)" strokeWidth={4} />
            <Area type="monotone" name="Tiến độ %" dataKey="progress" stroke={colors.secondary} fill="url(#progressFill)" strokeWidth={4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ProgressChart;
