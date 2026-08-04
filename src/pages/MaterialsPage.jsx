import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import MaterialGrid from '../components/MaterialsPage/MaterialGrid.jsx';
import MaterialLessonGrid from '../components/MaterialsPage/MaterialLessonGrid.jsx';
import MaterialPreview from '../components/MaterialsPage/MaterialPreview.jsx';
import MaterialsToolbar from '../components/MaterialsPage/MaterialsToolbar.jsx';
import PageShell from '../components/common/PageShell.jsx';
import Card from '../components/common/Card.jsx';
import { materialLessons, materials } from '../datas/materialsData.js';

function MaterialsPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  const selectedLesson = materialLessons.find((lesson) => lesson.id === selectedLessonId);
  const lessonMaterials = useMemo(
    () => selectedLessonId ? materials.filter((material) => material.lessonId === selectedLessonId) : [],
    [selectedLessonId],
  );

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return lessonMaterials.filter((material) => {
      const matchesFilter = activeFilter === 'Tất cả' || material.type === activeFilter;
      const matchesSearch = [material.title, material.course, material.teacher, material.lesson, ...material.tags]
        .some((value) => value.toLowerCase().includes(normalizedSearch));

      return matchesFilter && (!normalizedSearch || matchesSearch);
    });
  }, [activeFilter, lessonMaterials, searchTerm]);

  const selectedMaterial = filteredMaterials.find((material) => material.id === selectedMaterialId) ?? filteredMaterials[0] ?? null;

  function handleSelectLesson(lessonId) {
    const firstMaterial = materials.find((material) => material.lessonId === lessonId);
    setSelectedLessonId(lessonId);
    setSelectedMaterialId(firstMaterial?.id ?? null);
    setActiveFilter('Tất cả');
    setSearchTerm('');
  }

  function handleBackToLessons() {
    setSelectedLessonId(null);
    setSelectedMaterialId(null);
    setActiveFilter('Tất cả');
    setSearchTerm('');
  }

  return (
    <PageShell title="Tài liệu theo bài học" subtitle="Chọn bài học trước, sau đó xem toàn bộ tài liệu của bài đó.">
      {!selectedLesson ? (
        <MaterialLessonGrid lessons={materialLessons} onSelectLesson={handleSelectLesson} />
      ) : (
        <div className="space-y-6">
          <button type="button" onClick={handleBackToLessons} className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-md shadow-orange-100 transition hover:-translate-y-1 hover:text-[#F97316]">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách bài học
          </button>
          <Card className="bg-[#FFF7ED]">
            <p className="text-sm font-black uppercase text-[#F97316]">{selectedLesson.course}</p>
            <h2 className="mt-1 text-3xl font-black text-slate-900">{selectedLesson.title}</h2>
            <p className="mt-2 font-semibold leading-7 text-slate-600">{selectedLesson.description}</p>
          </Card>
          <MaterialsToolbar activeFilter={activeFilter} searchTerm={searchTerm} onFilterChange={setActiveFilter} onSearchChange={setSearchTerm} />
          <div className="grid items-start gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <MaterialGrid materials={filteredMaterials} selectedMaterialId={selectedMaterial?.id} onSelectMaterial={setSelectedMaterialId} />
            <MaterialPreview material={selectedMaterial} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default MaterialsPage;
