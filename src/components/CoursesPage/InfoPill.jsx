function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl bg-[#FFF7ED] p-4">
      <Icon className="h-6 w-6 text-[#F97316]" />
      <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default InfoPill;
