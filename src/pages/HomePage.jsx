import HeroBanner from '../components/HomePage/HeroBanner.jsx';
import LearningOverview from '../components/HomePage/LearningOverview.jsx';
import MenuGrid from '../components/HomePage/MenuGrid.jsx';
import TodayAndAchievements from '../components/HomePage/TodayAndAchievements.jsx';

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

export default HomePage;
