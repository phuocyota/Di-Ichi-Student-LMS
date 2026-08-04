import { ChevronRight, Play } from 'lucide-react';
import Card from '../common/Card.jsx';
import ProgressBar from '../common/ProgressBar.jsx';

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

export default LessonPlayer;
