import { CheckCircle2, Lock, Medal } from 'lucide-react';
import ProgressBar from '../common/ProgressBar.jsx';

function BadgeTile({ badge }) {
  const toneClass = badge.earned ? 'bg-[#FFF7ED]' : 'bg-slate-50 opacity-75';

  return (
    <div className={`rounded-3xl p-4 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <Medal className={`h-12 w-12 ${badge.earned ? 'text-[#F97316]' : 'text-slate-300'}`} />
        {badge.earned ? <CheckCircle2 className="h-5 w-5 text-[#22C55E]" /> : <Lock className="h-5 w-5 text-slate-300" />}
      </div>
      <h3 className="mt-3 text-lg font-black text-slate-900">{badge.title}</h3>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{badge.description}</p>
      <ProgressBar value={badge.progress} label="Tiến độ mở khóa" />
      <p className="mt-3 font-black text-[#F97316]">+{badge.xp} XP</p>
    </div>
  );
}

export default BadgeTile;
