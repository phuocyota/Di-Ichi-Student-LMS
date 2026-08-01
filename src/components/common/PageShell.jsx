function PageShell({ title, subtitle, children }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase text-[#F97316]">LMS Học sinh</p>
        <h2 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-2 text-base font-semibold text-slate-500 sm:text-lg">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export default PageShell;
