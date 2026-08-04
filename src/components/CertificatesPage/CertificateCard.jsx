import { Download, Eye, ShieldCheck } from 'lucide-react';
import Card from '../common/Card.jsx';

function CertificateCard({ cert, selected, onSelect }) {
  return (
    <Card className={`bg-gradient-to-br from-white to-orange-50 ring-2 transition ${selected ? 'ring-[#F97316]' : 'ring-transparent'}`}>
      <button type="button" onClick={onSelect} className="flex w-full items-start gap-4 text-left">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-orange-50 text-[#F97316]">
          <ShieldCheck className="h-9 w-9" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="rounded-3xl bg-green-50 px-3 py-1 text-xs font-black text-[#22C55E]">{cert.status}</span>
          <h3 className="mt-3 text-2xl font-black text-slate-900">{cert.title}</h3>
          <p className="mt-1 font-bold text-slate-500">{cert.course}</p>
          <p className="mt-2 text-sm font-black text-[#F97316]">Ngày cấp: {cert.issueDate}</p>
        </div>
      </button>
      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onSelect} className="inline-flex flex-1 items-center justify-center gap-2 rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200">
          Xem preview
          <Eye className="h-5 w-5" />
        </button>
        <a href={cert.downloadUrl} download={cert.fileName} className="grid h-14 w-14 place-items-center rounded-3xl bg-white text-[#F97316] shadow-md" aria-label="Tải chứng chỉ">
          <Download className="h-6 w-6" />
        </a>
      </div>
    </Card>
  );
}

export default CertificateCard;
