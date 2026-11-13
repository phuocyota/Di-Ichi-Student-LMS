import { useCallback, useEffect, useRef, useState } from 'react';
import SlidePresentation from '../../lesson-plans/SlidePresentation.jsx';
import {
  getClassLessonPlan,
  submitLessonAnswer,
} from '../../services/lessonPlanApi.js';
import '../../lesson-plans/lesson-planner.css';

export function ClassroomLesson({
  socket,
  connected,
  joinData,
  onPresent,
  onPresentationChange,
}) {
  const [presentation, setPresentation] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [loading, setLoading] = useState(false);
  const current = useRef(null);
  const queue = useRef(Promise.resolve());
  const planId = presentation?.planId;
  const revision = presentation?.revision;
  useEffect(() => {
    if (!socket) return;
    const receive = (event) => {
      if (
        event?.scheduleId !== joinData.scheduleId ||
        event.classId !== joinData.classId
      )
        return;
      const next = event.data;
      if (
        next !== null &&
        (!next ||
          typeof next.planId !== 'string' ||
          !Number.isSafeInteger(next.slideIndex) ||
          next.slideIndex < 0 ||
          !Number.isSafeInteger(next.revision) ||
          next.revision < 0)
      )
        return;
      const changed =
        next &&
        (current.current?.planId !== next.planId ||
          current.current?.revision !== next.revision);
      if (Boolean(next) !== Boolean(current.current))
        onPresentationChange?.(Boolean(next));
      current.current = next;
      setPresentation(next);
      if (changed) onPresent?.();
    };
    socket.on('lesson:presentation', receive);
    return () => socket.off('lesson:presentation', receive);
  }, [
    socket,
    joinData.scheduleId,
    joinData.classId,
    onPresent,
    onPresentationChange,
  ]);
  useEffect(() => {
    if (socket && connected)
      socket.emit('lesson:request', { scheduleId: joinData.scheduleId });
  }, [socket, connected, joinData.scheduleId]);
  useEffect(() => {
    const controller = new AbortController();
    setPlan(null);
    setError('');
    if (!planId) {
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    getClassLessonPlan(planId, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        if (
          result.classId !== joinData.classId ||
          !Array.isArray(result.blocks)
        )
          throw new Error('Giáo án không thuộc lớp học này');
        if ((result.revision || 0) !== revision)
          throw new Error(
            'Giáo án đã thay đổi. Vui lòng chờ giáo viên trình chiếu phiên bản mới.',
          );
        setPlan(result);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [planId, revision, joinData.classId, retry]);
  const onAnswer = useCallback(
    (blockId, values) => {
      if (!plan) return Promise.reject(new Error('Giáo án chưa sẵn sàng'));
      const request = queue.current
        .catch(() => {})
        .then(() =>
          submitLessonAnswer(plan.id, {
            revision: plan.revision,
            blockId,
            values,
          }),
        );
      queue.current = request;
      return request.then((progress) =>
        setPlan((previous) =>
          previous?.id === plan.id && previous.revision === plan.revision
            ? { ...previous, progress }
            : previous,
        ),
      );
    },
    [plan],
  );
  const validPlan =
    Boolean(plan) && plan.id === planId && (plan.revision || 0) === revision;
  return (
    <section
      className="live-lesson"
      aria-label="Giáo án trong lớp Live"
      aria-busy={loading}
    >
      <div className="live-lesson-heading">
        <div>
          <h2>Giáo án đang học</h2>
          <p>
            Slide được điều khiển bởi giáo viên. Bạn có thể làm bài ngay tại
            đây.
          </p>
        </div>
      </div>
      {!connected && <p role="status">Đang kết nối lại để cập nhật slide…</p>}
      {!presentation ? (
        <p>Chờ giáo viên chọn giáo án để bắt đầu trình chiếu.</p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)}>
            Thử lại
          </button>
        </div>
      ) : loading || !validPlan ? (
        <p role="status">Đang tải giáo án…</p>
      ) : (
        <SlidePresentation
          key={`${plan.id}:${revision}`}
          embedded
          plan={plan}
          slideIndex={presentation.slideIndex}
          navigationLocked
          onAnswer={onAnswer}
        />
      )}
    </section>
  );
}
