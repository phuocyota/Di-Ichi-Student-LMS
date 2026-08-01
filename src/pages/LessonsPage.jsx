import { BookOpen, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import PageShell from '../components/common/PageShell.jsx';
import ProgressBar from '../components/common/ProgressBar.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { lessons } from '../datas/lmsData.js';

function LessonsPage() {
  return (
    <PageShell title="Học bài" subtitle="Chọn chương, xem video, đọc nội dung và chuyển sang bài tiếp theo.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ChapterList />
        <LessonPlayer />
      </div>
    </PageShell>
  );
}

function ChapterList() {
  return (
    <Card>
      <SectionTitle icon={BookOpen} title="Danh sách chương" />
      <div className="mt-5 space-y-4">
        {lessons.map((chapter, chapterIndex) => (
          <div key={chapter.chapter} className="rounded-3xl bg-orange-50 p-4">
            <h3 className="text-lg font-black text-slate-900">{chapter.chapter}</h3>
            <div className="mt-3 space-y-2">
              {chapter.items.map((lesson, lessonIndex) => (
                <LessonItem key={lesson} lesson={lesson} active={chapterIndex === 1 && lessonIndex === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LessonPlayer() {
  return (
    <Card>
      <div className="overflow-hidden rounded-3xl bg-slate-950">
        <div className="grid aspect-video place-items-center bg-[radial-gradient(circle_at_center,#2563EB,transparent_34%),linear-gradient(135deg,#111827,#0f172a)]">
          <button className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#F97316] shadow-xl" aria-label="Phát video">
            <Play className="ml-1 h-10 w-10 fill-current" />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-sm font-black uppercase text-[#F97316]">Video bài học</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Past Simple Story</h2>
        <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
          Luyện cách kể chuyện bằng thì quá khứ đơn qua hoạt động nghe, đọc và nói theo tình huống gần gũi.
        </p>
        <ProgressBar value={54} label="Tiến độ bài học" />
        <button className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-[#F97316] px-6 py-4 font-black text-white shadow-lg shadow-orange-200">
          Bài tiếp theo <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}

function LessonItem({ lesson, active }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 font-bold shadow-sm">
      <span className="min-w-0 truncate">{lesson}</span>
      {active ? <Play className="h-5 w-5 shrink-0 text-[#F97316]" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22C55E]" />}
    </div>
  );
}

export default LessonsPage;
