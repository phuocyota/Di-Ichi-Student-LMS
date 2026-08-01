function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-[#FFF7ED] text-[#F97316]">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="min-w-0 text-xl font-black text-slate-900 sm:text-2xl">{title}</h2>
    </div>
  );
}

export default SectionTitle;
