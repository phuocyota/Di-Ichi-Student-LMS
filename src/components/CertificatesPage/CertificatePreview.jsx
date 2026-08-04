import { Award, CalendarClock, Download, Eye, Maximize2, School, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';

function CertificatePreview({ certificate }) {
  if (!certificate) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">Chứng chỉ đã cấp</p>
            <h2 className="mt-1 text-3xl font-black leading-tight text-slate-900">{certificate.title}</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">{certificate.description}</p>
          </div>
          <a href={certificate.downloadUrl} download={certificate.fileName} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-3xl bg-[#F97316] px-5 py-4 font-black text-white shadow-lg shadow-orange-200">
            Tải về
            <Download className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoPill icon={UserRound} label="Học viên" value={certificate.studentName} />
          <InfoPill icon={School} label="Đơn vị cấp" value={certificate.issuer} />
          <InfoPill icon={CalendarClock} label="Ngày cấp" value={certificate.issueDate} />
          <InfoPill icon={Award} label="Kết quả" value={certificate.score} />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle icon={Eye} title="Preview chứng chỉ" />
          <a href={certificate.previewUrl} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]" aria-label="Mở chứng chỉ toàn màn hình">
            <Maximize2 className="h-5 w-5" />
          </a>
        </div>
        <div className="mt-5 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-orange-100">
          <iframe className="h-[38rem] w-full bg-white" src={certificate.previewUrl} title={`Preview ${certificate.title}`} />
        </div>
      </Card>
    </div>
  );
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <Icon className="h-6 w-6 text-[#F97316]" />
      <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default CertificatePreview;
