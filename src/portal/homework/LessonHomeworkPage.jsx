import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { portalRequest } from "../../services/portalApi.js";
import { downloadPortalImage } from "../../services/lessonPlanApi.js";
import { usePortal } from "../portalStore.js";
import SlidePresentation from "../../lesson-plans/SlidePresentation.jsx";
export default function LessonHomeworkPage() {
  const { homeworkId } = useParams();
  return <HomeworkAttempt key={homeworkId} homeworkId={homeworkId} />;
}
function HomeworkAttempt({ homeworkId }) {
  const { mutate, busy } = usePortal();
  const [plan, setPlan] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [presenting, setPresenting] = useState(false),
    [saving, setSaving] = useState(false),
    [retry, setRetry] = useState(0);
  const queue = useRef(Promise.resolve()),
    requestIds = useRef(new Map()),
    lock = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    let image;
    setLoading(true);
    setPlan(null);
    setError("");
    setPresenting(false);
    portalRequest(`/homework/${encodeURIComponent(homeworkId)}/lesson`, {
      signal: controller.signal,
    })
      .then(async (next) => {
        if (!Array.isArray(next?.blocks) || !next.progress)
          throw new Error("Nội dung bài tập không hợp lệ");
        if (next.appearance?.backgroundFileId) {
          const blob = await downloadPortalImage(
            next.appearance.backgroundFileId,
            controller.signal,
          );
          if (controller.signal.aborted) return;
          image = URL.createObjectURL(blob);
          next.appearance = { ...next.appearance, backgroundImage: image };
        }
        if (!controller.signal.aborted) setPlan(next);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      if (image) URL.revokeObjectURL(image);
    };
  }, [homeworkId, retry]);
  async function start() {
    if (lock.current) return;
    lock.current = true;
    setSaving(true);
    setError("");
    try {
      const progress = await mutate(() =>
        portalRequest(`/homework/${homeworkId}/lesson/open`, {
          method: "POST",
        }),
      );
      if (!progress) throw new Error("Chưa ghi nhận mở bài. Vui lòng thử lại.");
      setPlan((p) => ({ ...p, progress }));
      setPresenting(true);
    } catch (e) {
      setError(e.message);
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  function answer(blockId, values) {
    const key = blockId + JSON.stringify(values);
    if (!requestIds.current.has(key))
      requestIds.current.set(key, crypto.randomUUID());
    const requestId = requestIds.current.get(key);
    const request = queue.current
      .catch(() => {})
      .then(async () => {
        lock.current = true;
        setSaving(true);
        try {
          const progress = await mutate(() =>
            portalRequest(`/homework/${homeworkId}/lesson/answers`, {
              method: "POST",
              body: { blockId, values, revision: plan.revision, requestId },
            }),
          );
          if (!progress)
            throw new Error("Chưa lưu được đáp án. Vui lòng thử lại.");
          requestIds.current.delete(key);
          setPlan((p) => ({ ...p, progress }));
          return progress;
        } finally {
          lock.current = false;
          setSaving(false);
        }
      });
    queue.current = request;
    return request;
  }
  return (
    <section className="portal">
      <header className="portal-toolbar">
        <h1>{plan?.title || "Bài tập từ giáo án"}</h1>
        <Link
          to="/homework"
          onClick={(e) => {
            if (saving) e.preventDefault();
          }}
        >
          ← Bài tập
        </Link>
      </header>
      {loading && <p role="status">Đang tải bài tập…</p>}
      {error && <p role="alert">{error}</p>}
      {plan && (
        <>
          <p>Hệ thống chấm tự động theo đáp án của giáo án được giao.</p>
          <p>
            {plan.progress.answered}/{plan.progress.total} câu đã làm · Đúng:{" "}
            {plan.progress.correct} · Sai: {plan.progress.incorrect}
          </p>
          <p>Điểm tự chấm: {plan.progress.score ?? "—"}/100</p>
          <button className="primary" disabled={saving || busy} onClick={start}>
            {saving
              ? "Đang lưu…"
              : plan.progress.firstViewedAt
                ? "Tiếp tục làm bài"
                : "Bắt đầu làm bài"}
          </button>
        </>
      )}
      {!plan && !loading && (
        <button onClick={() => setRetry((r) => r + 1)}>Thử lại</button>
      )}
      {plan && presenting && (
        <SlidePresentation
          plan={plan}
          onAnswer={answer}
          onClose={() => {
            if (!lock.current) setPresenting(false);
          }}
          closeDisabled={saving}
          summary={`${plan.progress.answered}/${plan.progress.total} câu · ${plan.progress.score ?? "—"}/100${saving ? " · Đang lưu…" : ""}`}
        />
      )}
    </section>
  );
}
