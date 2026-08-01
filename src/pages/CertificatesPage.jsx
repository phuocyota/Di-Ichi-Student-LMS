import { Download, ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { certificates } from '../datas/lmsData.js';

function CertificatesPage() {
  return (
    <PageShell title="Chứng chỉ" subtitle="Lưu lại những cột mốc học tập đáng tự hào.">
      <CertificateGrid />
    </PageShell>
  );
}

function CertificateGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {certificates.map((cert) => (
        <CertificateCard key={cert.title} cert={cert} />
      ))}
    </div>
  );
}

function CertificateCard({ cert }) {
  return (
    <Card className="bg-gradient-to-br from-white to-orange-50">
      <div className="rounded-3xl border-4 border-orange-100 bg-white p-6 text-center">
        <ShieldCheck className="mx-auto h-20 w-20 text-[#F97316]" />
        <h3 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">{cert.title}</h3>
        <p className="mt-2 font-bold text-slate-500">Ngày cấp: {cert.date}</p>
        <p className="font-black text-[#22C55E]">{cert.score}</p>
      </div>
      <div className="mt-5 flex gap-3">
        <button className="flex-1 rounded-3xl bg-[#F97316] py-4 font-black text-white">Xem</button>
        <button className="grid h-14 w-14 place-items-center rounded-3xl bg-white text-[#F97316] shadow-md" aria-label="Download">
          <Download className="h-6 w-6" />
        </button>
      </div>
    </Card>
  );
}

export default CertificatesPage;
