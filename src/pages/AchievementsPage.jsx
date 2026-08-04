import AchievementHighlights from '../components/AchievementsPage/AchievementHighlights.jsx';
import BadgePanel from '../components/AchievementsPage/BadgePanel.jsx';
import LeaderboardPanel from '../components/AchievementsPage/LeaderboardPanel.jsx';
import PageShell from '../components/common/PageShell.jsx';

function AchievementsPage() {
  return (
    <PageShell title="Thành tích" subtitle="Gamification giúp học sinh thấy rõ nỗ lực mỗi ngày.">
      <div className="space-y-6">
        <AchievementHighlights />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <BadgePanel />
          <LeaderboardPanel />
        </div>
      </div>
    </PageShell>
  );
}

export default AchievementsPage;
