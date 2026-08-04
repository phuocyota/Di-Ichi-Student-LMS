import CourseProgressList from '../components/ProgressPage/CourseProgressList.jsx';
import ProgressChart from '../components/ProgressPage/ProgressChart.jsx';
import ProgressSummary from '../components/ProgressPage/ProgressSummary.jsx';
import PageShell from '../components/common/PageShell.jsx';

function ProgressPage() {
  return (
    <PageShell title="Tiến độ học tập" subtitle="Theo dõi điểm, homework, quiz và biểu đồ tiến bộ.">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <ProgressSummary />
          <ProgressChart />
        </div>
        <CourseProgressList />
      </div>
    </PageShell>
  );
}

export default ProgressPage;
