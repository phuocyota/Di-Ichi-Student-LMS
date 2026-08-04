import { useEffect, useMemo, useState } from 'react';
import HomeworkDetailPanel from '../components/HomeworkPage/HomeworkDetailPanel.jsx';
import HomeworkGrid from '../components/HomeworkPage/HomeworkGrid.jsx';
import HomeworkOverview from '../components/HomeworkPage/HomeworkOverview.jsx';
import HomeworkToolbar from '../components/HomeworkPage/HomeworkToolbar.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { homework } from '../datas/homeworkData.js';

const PAGE_SIZE = 4;

function HomeworkPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(homework[0]?.id);
  const [page, setPage] = useState(1);
  const [submissionFiles, setSubmissionFiles] = useState({});

  const filteredHomework = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return homework.filter((item) => {
      const matchesFilter = activeFilter === 'Tất cả' || item.status === activeFilter;
      const matchesSearch = [item.title, item.course, item.teacher, item.type].some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesFilter && (!normalizedSearch || matchesSearch);
    });
  }, [activeFilter, searchTerm]);

  const selectedHomework = selectedHomeworkId ? homework.find((item) => item.id === selectedHomeworkId) ?? filteredHomework[0] : null;
  const selectedFiles = submissionFiles[selectedHomework?.id] ?? [];
  const totalPages = Math.max(1, Math.ceil(filteredHomework.length / PAGE_SIZE));

  useEffect(() => {
    if (filteredHomework.length === 0) {
      setSelectedHomeworkId(null);
      return;
    }

    const selectedHomeworkVisible = filteredHomework.some((item) => item.id === selectedHomeworkId);

    if (!selectedHomeworkVisible) {
      setSelectedHomeworkId(filteredHomework[0].id);
    }
  }, [filteredHomework, selectedHomeworkId]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchTerm]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handleSelectHomework(homeworkId) {
    setSelectedHomeworkId(homeworkId);
  }

  function handlePageChange(nextPage) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  function handleAddFiles(files) {
    if (!selectedHomework) {
      return;
    }

    const nextFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }));

    setSubmissionFiles((current) => ({
      ...current,
      [selectedHomework.id]: [...(current[selectedHomework.id] ?? []), ...nextFiles],
    }));
  }

  function handleRemoveFile(fileId) {
    if (!selectedHomework) {
      return;
    }

    setSubmissionFiles((current) => ({
      ...current,
      [selectedHomework.id]: (current[selectedHomework.id] ?? []).filter((file) => file.id !== fileId),
    }));
  }

  return (
    <PageShell title="Homework" subtitle="Quản lý bài tập, hạn nộp, tài liệu, nộp bài và feedback từ giáo viên.">
      <div className="space-y-6">
        <HomeworkOverview />
        <HomeworkToolbar activeFilter={activeFilter} searchTerm={searchTerm} onFilterChange={setActiveFilter} onSearchChange={setSearchTerm} />
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <HomeworkGrid
            homeworkItems={filteredHomework}
            selectedHomeworkId={selectedHomework?.id}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            onSelectHomework={handleSelectHomework}
          />
          <HomeworkDetailPanel homework={selectedHomework} files={selectedFiles} onAddFiles={handleAddFiles} onRemoveFile={handleRemoveFile} />
        </div>
      </div>
    </PageShell>
  );
}

export default HomeworkPage;
