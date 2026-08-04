import CourseCard from './CourseCard.jsx';
import { courses } from '../../datas/courseData.js';

function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.title} course={course} />
      ))}
    </div>
  );
}

export default CourseGrid;
