import TaskCard from './TaskCard.jsx';

import Pagination from './Pagination.jsx';

function HomeworkGrid({ homeworkItems, selectedHomeworkId, page, pageSize, onPageChange, onSelectHomework }) {
  const totalPages = Math.max(1, Math.ceil(homeworkItems.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visibleHomework = homeworkItems.slice(startIndex, startIndex + pageSize);

  if (homeworkItems.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-orange-100">
        <h3 className="text-2xl font-black text-slate-900">Không tìm thấy bài tập</h3>
        <p className="mt-2 font-semibold text-slate-500">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {visibleHomework.map((item) => (
          <TaskCard
            key={item.title}
            item={item}
            selected={item.id === selectedHomeworkId}
            onSelect={() => onSelectHomework(item.id)}
          />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} totalItems={homeworkItems.length} pageSize={pageSize} onPageChange={onPageChange} />
    </div>
  );
}

export default HomeworkGrid;
