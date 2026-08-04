import { Search, SlidersHorizontal } from 'lucide-react';
import { materialFilters } from '../../datas/materialsData.js';

function MaterialsToolbar({ activeFilter, searchTerm, onFilterChange, onSearchChange }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-lg shadow-orange-100 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-3xl bg-orange-50 px-4 font-bold text-slate-500">
        <Search className="h-5 w-5 text-[#F97316]" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Tìm tài liệu, khóa học, chủ đề"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {materialFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`shrink-0 rounded-3xl px-4 py-3 text-sm font-black ${activeFilter === filter ? 'bg-[#F97316] text-white shadow-md shadow-orange-200' : 'bg-orange-50 text-[#F97316]'}`}
          >
            {filter}
          </button>
        ))}
        <button className="grid h-12 w-12 shrink-0 place-items-center rounded-3xl bg-slate-100 text-slate-500" aria-label="Bộ lọc nâng cao">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

export default MaterialsToolbar;
