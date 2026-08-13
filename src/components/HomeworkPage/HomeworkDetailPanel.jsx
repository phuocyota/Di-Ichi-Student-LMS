import { Download, Eye, FileText, MessageCircle, Paperclip, UserRound } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import SubmissionPanel from './SubmissionPanel.jsx';

function HomeworkDetailPanel({ homework, files, onAddFiles, onRemoveFile }) {
  if (!homework) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle icon={FileText} title="Chi tiết bài tập" />
        <div className="mt-5">
          <p className="text-sm font-black uppercase text-[#F97316]">{homework.type}</p>
          <h3 className="mt-1 text-3xl font-black text-slate-900">{homework.title}</h3>
          <p className="mt-2 font-bold text-slate-500">{homework.course} - {homework.teacher}</p>
        </div>

        <div className="mt-5 rounded-3xl bg-orange-50 p-4">
          <p className="text-sm font-black uppercase text-[#F97316]">Yêu cầu bài tập</p>
          <p className="mt-2 font-semibold leading-7 text-slate-700">{homework.instruction}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <DetailMetric label="Hạn nộp" value={homework.due} />
          <DetailMetric label="Thời lượng" value={homework.estimatedTime} />
          <DetailMetric label="Trạng thái" value={homework.status} />
          <DetailMetric label="Điểm" value={homework.score} />
        </div>

        <div className="mt-5">
          <p className="text-sm font-black uppercase text-slate-400">Rubric</p>
          <div className="mt-3 space-y-2">
            {homework.rubric.map((rubric) => (
              <div key={rubric.label} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                <span className="font-bold text-slate-600">{rubric.label}</span>
                <span className="font-black text-[#F97316]">{rubric.points}đ</span>
              </div>
            ))}
          </div>
        </div>

        
      </Card>

      <HomeworkFilePreview homework={homework} />

      <SubmissionPanel homework={homework} files={files} onAddFiles={onAddFiles} onRemoveFile={onRemoveFile} />

      <Card className="bg-[#FFF7ED]">
        <SectionTitle icon={MessageCircle} title="Feedback" />
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-3xl bg-orange-50 text-[#F97316]">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="font-black text-slate-900">{homework.teacher}</p>
              <p className="text-sm font-bold text-slate-400">Giáo viên phụ trách</p>
            </div>
          </div>
          <p className="mt-4 font-semibold leading-7 text-slate-600">{homework.feedback}</p>
        </div>
      </Card>
    </div>
  );
}

function HomeworkFilePreview({ homework }) {
  const assignmentFile = homework.assignmentFile;

  if (!assignmentFile) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-black text-slate-950">Tài liệu đính kèm</h3>
      <div className="mt-4">
        <AttachmentFileCard file={assignmentFile} />
      </div>
    </Card>
  );
}

function AttachmentFileCard({ file }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
      <div className="flex items-start gap-3">
        <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-50 text-[#F97316]">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="min-w-0 text-lg font-black leading-7 text-slate-950">{file.title}</h4>
            <span className="shrink-0 rounded-2xl bg-slate-50 px-3 py-1 text-sm font-black text-slate-500 ring-1 ring-slate-200">{file.format}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={file.previewUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-black text-[#B45309] ring-1 ring-orange-100">
              <Eye className="h-4 w-4" />
              Xem trước
            </a>
            <a href={file.downloadUrl} download={file.fileName} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-4 font-black text-white shadow-md shadow-orange-200">
              <Download className="h-4 w-4" />
              Tải về
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailMetric({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

export default HomeworkDetailPanel;
