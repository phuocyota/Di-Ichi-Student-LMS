import { Trophy } from 'lucide-react';
import Card from '../common/Card.jsx';
import MiniMetric from '../common/MiniMetric.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import BadgeTile from './BadgeTile.jsx';
import { getAchievementSummary } from '../../datas/achievementData.js';

function BadgePanel() {
  const summary = getAchievementSummary();

  return (
    <Card>
      <SectionTitle icon={Trophy} title="Huy hiệu & XP" />
      <div className="mt-5 grid grid-cols-2 gap-4">
        {summary.earnedBadges.map((badge) => (
          <BadgeTile key={badge.id} badge={badge} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <MiniMetric label="XP" value={summary.totalXp} />
        <MiniMetric label="Level" value={summary.level} />
        <MiniMetric label="Streak" value={`${summary.streak}`} />
      </div>
    </Card>
  );
}

export default BadgePanel;
