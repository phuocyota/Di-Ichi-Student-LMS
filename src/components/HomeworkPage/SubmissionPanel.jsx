import { Paperclip, Trash2, Upload } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';

function SubmissionPanel({ homework, files, onAddFiles, onRemoveFile }) {
  if (!homework) {
    return null;
  }

  return (
    <Card>
      <SectionTitle icon={Upload} title="Nộp bài" />
      <div className="mt-5 rounded-3xl bg-blue-50 p-4">
        <p className="text-xs font-black uppercase text-[#2563EB]">Đang nộp cho bài tập</p>
        <h3 className="mt-1 text-xl font-black text-slate-900">{homework.title}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">{homework.course} - Hạn nộp: {homework.due}</p>
      </div>
      <label className="mt-5 block cursor-pointer rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/70 p-5 text-center transition hover:bg-orange-100">
        <Upload className="mx-auto h-10 w-10 text-[#F97316]" />
        <h3 className="mt-3 text-lg font-black text-slate-900">Tải file bài làm</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">Hỗ trợ PDF, Word, ảnh hoặc audio dưới 50MB.</p>
        <input type="file" multiple className="hidden" onChange={(event) => onAddFiles(event.target.files)} />
      </label>
      <div className="mt-4 space-y-3">
        {files.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-4 text-center font-bold text-slate-500">Chưa có file nào cho bài tập này.</div>
        ) : files.map((file) => (
          <div key={file.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
            <div className="min-w-0">
              <span className="block truncate font-black text-slate-700">{file.name}</span>
              <span className="text-sm font-bold text-slate-400">{formatFileSize(file.size)}</span>
            </div>
            <Paperclip className="h-5 w-5 shrink-0 text-[#F97316]" />
            <button type="button" onClick={() => onRemoveFile(file.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-3xl bg-red-50 text-[#EF4444]" aria-label="Xóa file">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button className="mt-5 w-full rounded-3xl bg-[#F97316] py-4 font-black text-white shadow-lg shadow-orange-200 disabled:bg-slate-300 disabled:shadow-none" disabled={files.length === 0}>
        Gửi bài cho giáo viên
      </button>
    </Card>
  );
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default SubmissionPanel;
