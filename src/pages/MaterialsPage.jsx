import { ChevronRight } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { iconMap } from '../components/icons/iconMap.jsx';
import { materials } from '../datas/lmsData.js';

function MaterialsPage() {
  return (
    <PageShell title="Tài liệu" subtitle="PDF, video, audio, slide và Word được sắp theo grid dễ chạm.">
      <MaterialGrid />
    </PageShell>
  );
}

function MaterialGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((item) => (
        <MaterialCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function MaterialCard({ item }) {
  const Icon = iconMap[item.icon];

  return (
    <Card>
      <Icon className={`h-14 w-14 ${item.color}`} />
      <p className="mt-5 text-sm font-black uppercase text-slate-400">{item.type}</p>
      <h3 className="mt-1 text-2xl font-black text-slate-900">{item.title}</h3>
      <button className="mt-6 inline-flex items-center gap-2 rounded-3xl bg-orange-50 px-5 py-3 font-black text-[#F97316]">
        Mở tài liệu <ChevronRight className="h-5 w-5" />
      </button>
    </Card>
  );
}

export default MaterialsPage;
