import { BookOpen, Clock3, FileText, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';

function MaterialLessonGrid({ lessons, onSelectLesson }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="flex h-full flex-col">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-orange-50 text-[#F97316]">
            <BookOpen className="h-9 w-9" />
          </div>
          <p className="mt-5 text-sm font-black uppercase text-[#F97316]">{lesson.course}</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900">{lesson.title}</h3>
          <p className="mt-3 flex-1 font-semibold leading-7 text-slate-600">{lesson.description}</p>
          <div className="mt-5 grid gap-3">
            <LessonMetric icon={UserRound} label="Giáo viên" value={lesson.teacher} />
            <LessonMetric icon={Clock3} label="Thời lượng" value={lesson.duration} />
            <LessonMetric icon={FileText} label="Tài liệu" value={`${lesson.materialCount} file`} />
          </div>
          <button type="button" onClick={() => onSelectLesson(lesson.id)} className="mt-5 w-full rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200">
            Xem tài liệu bài học
          </button>
        </Card>
      ))}
    </section>
  );
}

function LessonMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 px-4 py-3">
      <span className="inline-flex items-center gap-2 font-bold text-slate-500">
        <Icon className="h-4 w-4 text-[#F97316]" />
        {label}
      </span>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}

export default MaterialLessonGrid;
