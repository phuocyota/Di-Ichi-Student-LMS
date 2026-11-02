import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getClassLessonPlan, getClassLessonPlans } from '../services/lessonPlanApi.js';
import PageShell from '../components/common/PageShell.jsx';
import SlidePresentation from '../lesson-plans/SlidePresentation.jsx';
import '../lesson-plans/lesson-planner.css';

export function ClassLessonPlanList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getClassLessonPlans(controller.signal).then((data) => {
      if (!Array.isArray(data?.items)) throw new Error('Danh sách giáo án không hợp lệ');
      if (!controller.signal.aborted) setItems(data.items);
    }).catch((e) => {
      if (!controller.signal.aborted) setError(e.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [reload]);
  return (
    <section className="mb-6 rounded-3xl bg-white p-5 shadow-sm" aria-busy={loading}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Giáo án của lớp</h2>
        <button onClick={() => setReload((v) => v + 1)} disabled={loading}>Tải lại</button>
      </div>
      {loading ? <p role="status">Đang tải giáo án…</p> : error ? <p role="alert">{error}</p> : !items.length ? (
        <p className="mt-3 text-slate-600">Giáo viên chưa chia sẻ giáo án cho lớp của bạn.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-2xl border border-orange-100 p-4">
              <Link className="font-bold text-orange-700" to={`/lessons/plans/${item.id}`}>{item.title}</Link>
              <p className="text-sm text-slate-600">{item.className} · {item.subject || 'Giáo án'} · {item.duration} phút</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ClassLessonPlanPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setPlan(null);
    setError('');
    getClassLessonPlan(planId, controller.signal).then((data) => {
      if (!Array.isArray(data?.blocks)) throw new Error('Nội dung giáo án không hợp lệ');
      if (!controller.signal.aborted) setPlan(data);
    }).catch((e) => {
      if (!controller.signal.aborted) setError(e.message);
    });
    return () => controller.abort();
  }, [planId]);
  return (
    <PageShell title={plan?.title || 'Giáo án của lớp'} subtitle="Xem nội dung và thực hành các hoạt động giáo viên đã chia sẻ.">
      <Link to="/lessons">← Về danh sách bài học</Link>
      {error ? <p role="alert">{error}</p> : !plan ? <p role="status">Đang tải giáo án…</p> : (
        <SlidePresentation key={plan.id} plan={plan} onClose={() => navigate("/lessons")} />
      )}
    </PageShell>
  );
}
