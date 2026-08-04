import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CalendarClock, CheckCircle2, Clock3, FileText, PlayCircle, Target, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import InfoPill from './InfoPill.jsx';

function CourseDetail({ course }) {
  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:text-[#F97316]">
        <ArrowLeft className="h-4 w-4" />
        Quay lại khóa học
      </Link>

      <section className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-100">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-72">
            <img className="absolute inset-0 h-full w-full object-cover" src={course.image} alt={course.title} />
            <div className="absolute left-5 top-5 rounded-3xl bg-white/90 px-4 py-2 text-sm font-black text-[#F97316] backdrop-blur">
              {course.tag}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
            <div>
              <p className="text-sm font-black uppercase text-[#F97316]">Chi tiết khóa học</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">{course.title}</h2>
              <p className="mt-4 text-base font-semibold leading-7 text-slate-500">{course.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoPill icon={UserRound} label="Giáo viên" value={course.teacher} />
              <InfoPill icon={CalendarClock} label="Lịch học" value={course.schedule} />
              <InfoPill icon={Target} label="Cấp độ" value={course.level} />
            </div>

            <div>
              <ProgressBar value={course.progress} label={`Tiến độ hoàn thành ${course.progress}%`} />
              <Link to="/lessons" state={{ fromCourseDetail: true, courseTitle: course.title }} className="mt-5 inline-flex items-center gap-2 rounded-3xl bg-[#F97316] px-6 py-4 font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1">
                Vào bài học tiếp theo
                <PlayCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <SectionTitle icon={BookOpen} title="Lộ trình bài học" />
          <div className="mt-5 space-y-3">
            {course.lessons.map((lesson, index) => (
              <Link
                key={lesson.title}
                to="/lessons"
                state={{ fromCourseDetail: true, courseTitle: course.title, lessonTitle: lesson.title }}
                className="flex items-center gap-4 rounded-3xl bg-orange-50/70 p-4 transition hover:-translate-y-1 hover:bg-orange-100"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-3xl bg-white text-sm font-black text-[#F97316] shadow-sm">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-black text-slate-900">{lesson.title}</h3>
                  <p className="text-sm font-bold text-slate-500">{lesson.status}</p>
                </div>
                <div className="inline-flex shrink-0 items-center gap-1 rounded-3xl bg-white px-3 py-2 text-sm font-black text-slate-500">
                  <Clock3 className="h-4 w-4 text-[#F97316]" />
                  {lesson.minutes} phút
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#FFF7ED]">
            <SectionTitle icon={CheckCircle2} title="Mục tiêu đạt được" />
            <div className="mt-5 space-y-3">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="flex gap-3 rounded-3xl bg-white p-4 font-bold text-slate-600 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={FileText} title="Tài liệu khóa học" />
            <div className="mt-5 space-y-3">
              {course.resources.map((resource) => (
                <div key={resource} className="flex items-center justify-between gap-3 rounded-3xl border border-orange-100 p-4">
                  <span className="font-black text-slate-700">{resource}</span>
                  <FileText className="h-5 w-5 shrink-0 text-[#F97316]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
