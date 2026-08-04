import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function BackToPreviousButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.fromCourseDetail) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-5 inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:text-[#F97316]"
    >
      <ArrowLeft className="h-4 w-4" />
      Quay lại trang trước
    </button>
  );
}

export default BackToPreviousButton;
