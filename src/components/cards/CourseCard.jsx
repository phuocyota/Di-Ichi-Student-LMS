import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';

function CourseCard({ course }) {
  return (
    <Card className="overflow-hidden p-0">
      <img className="h-48 w-full object-cover" src={course.image} alt={course.title} />
      <div className="p-5">
        <span className="rounded-3xl bg-[#FFF7ED] px-3 py-1 text-sm font-black text-[#F97316]">{course.tag}</span>
        <h3 className="mt-4 text-2xl font-black text-slate-900">{course.title}</h3>
        <p className="mt-1 font-bold text-slate-500">Giáo viên: {course.teacher}</p>
        <ProgressBar value={course.progress} />
        <button className="mt-5 w-full rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1">
          Tiếp tục học
        </button>
      </div>
    </Card>
  );
}

export default CourseCard;
