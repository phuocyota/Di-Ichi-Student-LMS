import { Navigate, useParams } from 'react-router-dom';
import CourseDetail from '../components/CoursesPage/CourseDetail.jsx';
import CourseGrid from '../components/CoursesPage/CourseGrid.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { courses } from '../datas/courseData.js';

function CoursesPage() {
  const { courseId } = useParams();
  const selectedCourse = courseId ? courses.find((course) => course.id === courseId) : null;

  if (courseId && !selectedCourse) {
    return <Navigate to="/courses" replace />;
  }

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} />;
  }

  return (
    <PageShell title="Khóa học của em" subtitle="Chọn khóa học để tiếp tục hành trình tiếng Anh.">
      <CourseGrid />
    </PageShell>
  );
}

export default CoursesPage;
