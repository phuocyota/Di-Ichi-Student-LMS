import { motion } from 'framer-motion';

function ProgressBar({ value, label }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black text-slate-600">
        <span className="min-w-0 truncate">{label || 'Tiến độ'}</span>
        <span>{value}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-orange-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#FDBA74]"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
