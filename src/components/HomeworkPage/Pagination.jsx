import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-lg shadow-orange-100 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-bold text-slate-500">Hiển thị {start}-{end} trong {totalItems} bài tập</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="grid h-11 w-11 place-items-center rounded-3xl bg-orange-50 text-[#F97316] disabled:bg-slate-100 disabled:text-slate-300"
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`h-11 min-w-11 rounded-3xl px-4 font-black ${pageNumber === page ? 'bg-[#F97316] text-white' : 'bg-orange-50 text-[#F97316]'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="grid h-11 w-11 place-items-center rounded-3xl bg-orange-50 text-[#F97316] disabled:bg-slate-100 disabled:text-slate-300"
          aria-label="Trang sau"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
