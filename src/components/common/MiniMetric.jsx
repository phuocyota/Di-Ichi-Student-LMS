function MiniMetric({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 truncate text-base font-black text-slate-900 sm:text-lg">{value}</p>
    </div>
  );
}

export default MiniMetric;
