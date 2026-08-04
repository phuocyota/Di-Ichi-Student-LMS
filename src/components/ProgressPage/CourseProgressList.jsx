import { BookOpen } from 'lucide-react';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import { getCourseProgressBreakdown } from '../../datas/progressData.js';

function CourseProgressList() {
  const courseProgress = getCourseProgressBreakdown();

  return (
    <Card>
      <SectionTitle icon={BookOpen} title="Theo từng khóa học" />
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {courseProgress.map((course) => (
          <div key={course.id} className="rounded-3xl bg-slate-50 p-4">
            <h3 className="text-xl font-black text-slate-900">{course.title}</h3>
            <p className="mt-1 font-bold text-slate-500">{course.teacher}</p>
            <ProgressBar value={course.progress} label="Tiến độ khóa học" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="HW" value={course.homework} />
              <Metric label="Quiz" value={course.quiz} />
              <Metric label="Điểm" value={course.score} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-3 text-center shadow-sm">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default CourseProgressList;
