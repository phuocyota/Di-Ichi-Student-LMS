import { BookOpen, Download, Eye, FileText, Maximize2, Presentation, Tags, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';

function MaterialPreview({ material }) {
  if (!material) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#F97316]">{material.type}</p>
            <h2 className="mt-1 text-3xl font-black leading-tight text-slate-900">{material.title}</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">{material.description}</p>
          </div>
          <a href={material.downloadUrl} download={material.fileName} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-3xl bg-[#F97316] px-5 py-4 font-black text-white shadow-lg shadow-orange-200">
            Tải về
            <Download className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <InfoPill icon={BookOpen} label="Khóa học" value={material.course} />
          <InfoPill icon={UserRound} label="Giáo viên" value={material.teacher} />
          <InfoPill icon={FileText} label="Định dạng" value={material.size} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {material.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2 rounded-3xl bg-orange-50 px-4 py-2 font-black text-[#F97316]">
              <Tags className="h-4 w-4" />
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle icon={Eye} title="Preview tài liệu" />
          <a href={material.previewUrl} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-3xl bg-blue-50 text-[#2563EB]" aria-label="Mở preview toàn màn hình">
            <Maximize2 className="h-5 w-5" />
          </a>
        </div>
        <PreviewFrame material={material} />
        {material.previewType === 'docx' ? (
          <p className="mt-3 text-sm font-bold text-slate-500">Bản Word được preview bằng file PDF cùng nội dung để xem nhanh trong trình duyệt.</p>
        ) : null}
        {material.previewType === 'pptx' ? (
          <p className="mt-3 text-sm font-bold text-slate-500">Trình duyệt không luôn xem trực tiếp PPTX ổn định, hãy tải về hoặc mở file để xem đầy đủ hiệu ứng.</p>
        ) : null}
      </Card>
    </div>
  );
}

function PreviewFrame({ material }) {
  if (material.previewType === 'video') {
    return (
      <div className="mt-5 overflow-hidden rounded-3xl bg-slate-950 ring-1 ring-orange-100">
        <video className="h-full max-h-[34rem] w-full bg-black" src={material.previewUrl} controls preload="metadata">
          Trình duyệt của bạn không hỗ trợ xem video trực tiếp.
        </video>
      </div>
    );
  }

  if (material.previewType === 'pptx') {
    return (
      <div className="mt-5 grid min-h-[24rem] place-items-center rounded-3xl bg-gradient-to-br from-amber-50 to-white p-8 text-center ring-1 ring-orange-100">
        <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-100 text-[#F59E0B]">
            <Presentation className="h-11 w-11" />
          </div>
          <h3 className="mt-5 text-2xl font-black text-slate-900">{material.title}</h3>
          <p className="mx-auto mt-3 max-w-md font-semibold leading-7 text-slate-600">File trình chiếu PowerPoint có thể tải về để xem đầy đủ bố cục, animation và nội dung slide.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={material.downloadUrl} download={material.fileName} className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#F97316] px-5 py-4 font-black text-white shadow-lg shadow-orange-200">
              Tải PPTX
              <Download className="h-5 w-5" />
            </a>
            <a href={material.previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-4 font-black text-[#F59E0B] shadow-md">
              Mở file
              <Maximize2 className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-orange-100">
      <iframe className="h-[34rem] w-full bg-white" src={material.previewUrl} title={`Preview ${material.title}`} />
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

export default MaterialPreview;
