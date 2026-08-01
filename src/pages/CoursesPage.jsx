import CourseCard from '../components/cards/CourseCard.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { courses } from '../datas/lmsData.js';

function CoursesPage() {
  return (
    <PageShell title="Khóa học của em" subtitle="Chọn khóa học để tiếp tục hành trình tiếng Anh.">
      <CourseGrid />
    </PageShell>
  );
}

function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.title} course={course} />
      ))}
    </div>
  );
}

export default CoursesPage;
