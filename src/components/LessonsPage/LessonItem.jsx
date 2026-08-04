import { CheckCircle2, Play } from 'lucide-react';

function LessonItem({ lesson, active }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 font-bold shadow-sm">
      <span className="min-w-0 truncate">{lesson}</span>
      {active ? <Play className="h-5 w-5 shrink-0 text-[#F97316]" /> : <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22C55E]" />}
    </div>
  );
}

export default LessonItem;
