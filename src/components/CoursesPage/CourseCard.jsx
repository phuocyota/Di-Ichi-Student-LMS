import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="block h-full">
      <Card className="h-full overflow-hidden p-0">
        <img className="h-48 w-full object-cover" src={course.image} alt={course.title} />
        <div className="p-5">
          <span className="rounded-3xl bg-[#FFF7ED] px-3 py-1 text-sm font-black text-[#F97316]">{course.tag}</span>
          <h3 className="mt-4 text-2xl font-black text-slate-900">{course.title}</h3>
          <p className="mt-1 font-bold text-slate-500">Giáo viên: {course.teacher}</p>
          <ProgressBar value={course.progress} />
          <div className="mt-5 w-full rounded-3xl bg-[#F97316] py-4 text-center font-black text-white shadow-lg shadow-orange-200">
            Tiếp tục học
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default CourseCard;
