import { Clock3, GraduationCap, MessageCircle, Video } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { onlineClasses } from '../datas/lmsData.js';

function OnlinePage() {
  return (
    <PageShell title="Lớp học Online" subtitle="Vào lớp nhanh với nút tham gia lớn, tối ưu cho tablet và mobile.">
      <OnlineClassGrid />
    </PageShell>
  );
}

function OnlineClassGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {onlineClasses.map((item) => (
        <OnlineClassCard key={item.className} item={item} />
      ))}
    </div>
  );
}

function OnlineClassCard({ item }) {
  return (
    <Card>
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]">
        <Video className="h-11 w-11" />
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">{item.className}</h3>
      <div className="mt-4 space-y-3 text-base font-bold text-slate-600 sm:text-lg">
        <p><Clock3 className="mr-2 inline h-5 w-5 text-[#F97316]" />{item.time}</p>
        <p><GraduationCap className="mr-2 inline h-5 w-5 text-[#2563EB]" />{item.teacher}</p>
        <p><MessageCircle className="mr-2 inline h-5 w-5 text-[#22C55E]" />{item.room}</p>
      </div>
      <button className="mt-8 w-full rounded-3xl bg-[#F97316] py-5 text-xl font-black text-white shadow-lg shadow-orange-200">Tham gia</button>
    </Card>
  );
}

export default OnlinePage;
