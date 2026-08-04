import MaterialCard from './MaterialCard.jsx';

function MaterialGrid({ materials, selectedMaterialId, onSelectMaterial }) {
  if (materials.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-orange-100">
        <h3 className="text-2xl font-black text-slate-900">Không tìm thấy tài liệu</h3>
        <p className="mt-2 font-semibold text-slate-500">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-max content-start gap-4">
      {materials.map((item) => (
        <MaterialCard key={item.title} item={item} selected={item.id === selectedMaterialId} onSelect={() => onSelectMaterial(item.id)} />
      ))}
    </div>
  );
}

export default MaterialGrid;
