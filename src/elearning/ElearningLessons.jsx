import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { portalRequest } from "../services/portalApi.js";
import { LessonScene } from "./LessonAppearance.jsx";
import BlockPlayer from "./BlockPlayer.jsx";
import "./lesson-planner.css";
import "./elearning.css";

export function ElearningList() {
  const [items, setItems] = useState(null),
    [error, setError] = useState(""),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setError("");
    setItems(null);
    portalRequest("/elearning", { signal: c.signal })
      .then((data) => {
        if (!c.signal.aborted) {
          if (!Array.isArray(data.items))
            throw new Error("Danh sách bài học không hợp lệ");
          setItems(data.items);
        }
      })
      .catch((e) => {
        if (!c.signal.aborted) setError(e.message);
      });
    return () => c.abort();
  }, [retry]);
  return (
    <section className="el-list">
      <h2>Bài e-learning được giao</h2>
      {error ? (
        <p role="alert">
          {error}{" "}
          <button onClick={() => setRetry((v) => v + 1)}>Thử lại</button>
        </p>
      ) : items === null ? (
        <p role="status">Đang tải bài e-learning…</p>
      ) : !items.length ? (
        <p>Chưa có bài e-learning được giao cho lớp của bạn.</p>
      ) : (
        <div className="el-cards">
          {items.map((item) => (
            <Link key={item.id} to={"/elearning/" + item.id}>
              <span>{item.className}</span>
              <h3>{item.title}</h3>
              <p>
                Đã xem {item.visitedPageIds.length}/{item.pageCount} trang
              </p>
              <strong>
                {item.visitedPageIds.length ? "Học tiếp" : "Mở bài học"} →
              </strong>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
export default function ElearningLesson() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null),
    [page, setPage] = useState(0),
    [error, setError] = useState(""),
    [saveError, setSaveError] = useState(""),
    [busy, setBusy] = useState(false),
    [retry, setRetry] = useState(0),
    [paused, setPaused] = useState(false),
    [scale, setScale] = useState(1);
  const viewport = useRef(null),
    lock = useRef(false);
  useEffect(() => {
    const c = new AbortController();
    setCourse(null);
    setError("");
    setSaveError("");
    portalRequest("/elearning/" + courseId, { signal: c.signal })
      .then((data) => {
        if (c.signal.aborted) return;
        if (
          !data.pages?.length ||
          !Array.isArray(data.blocks) ||
          !Array.isArray(data.visitedPageIds)
        )
          throw new Error("Nội dung bài học không hợp lệ");
        setCourse(data);
        const next = data.pages.findIndex(
          (p) => !data.visitedPageIds.includes(p.id),
        );
        setPage(Math.max(0, next));
      })
      .catch((e) => {
        if (!c.signal.aborted) setError(e.message);
      });
    return () => c.abort();
  }, [courseId, retry]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () =>
      setScale(Math.min(1, Math.max(0.2, el.clientWidth / 1000)));
    measure();
    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [course]);
  const viewed = async () => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setSaveError("");
    try {
      const result = await portalRequest("/elearning/" + courseId + "/visit", {
        method: "POST",
        body: { version: course.version, pageId: course.pages[page].id },
      });
      if (!Array.isArray(result.visitedPageIds))
        throw new Error("Máy chủ chưa xác nhận tiến độ");
      setCourse((c) => ({ ...c, visitedPageIds: result.visitedPageIds }));
      if (page < course.pages.length - 1) setPage(page + 1);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <div className="lesson-planner el-player">
      <Link to="/lessons">← Bài học của tôi</Link>
      {error ? (
        <div role="alert">
          {error}{" "}
          <button onClick={() => setRetry((v) => v + 1)}>
            Tải lại bài học
          </button>
        </div>
      ) : !course ? (
        <p role="status">Đang tải bài học…</p>
      ) : (
        <>
          <header>
            <h1>{course.title}</h1>
            <p>
              Trang {page + 1}/{course.pages.length} ·{" "}
              {course.pages[page].title}
            </p>
            <p>
              Đã xem {course.visitedPageIds.length}/{course.pages.length} trang.
              Câu trả lời luyện tập chỉ giữ trong lần mở bài này.
            </p>
            <button aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
              {paused ? "Bật hiệu ứng" : "Tạm dừng hiệu ứng"}
            </button>
          </header>
          {saveError && (
            <p role="alert">
              Chưa lưu được tiến độ: {saveError}{" "}
              <button onClick={() => setRetry((v) => v + 1)}>
                Tải lại bản mới
              </button>
            </p>
          )}
          <div className="el-viewport" ref={viewport}>
            <div style={{ width: 1000 * scale, height: 700 * scale }}>
              <div
                className="el-stage"
                style={{ transform: `scale(${scale})` }}
              >
                <LessonScene
                  appearance={course.appearance}
                  paused={paused}
                  className="el-scene"
                >
                  {course.blocks.map((b) => (
                    <article
                      key={b.id}
                      hidden={b.pageId !== course.pages[page].id}
                      className="el-object lp-animated-block"
                      style={{
                        left: b.layout?.x || 0,
                        top: b.layout?.y || 0,
                        width: b.layout?.width || 400,
                        height: b.layout?.height || 300,
                      }}
                    >
                      {(b.type !== "video" ||
                        b.pageId === course.pages[page].id) && (
                        <BlockPlayer block={b} />
                      )}
                    </article>
                  ))}
                </LessonScene>
              </div>
            </div>
          </div>
          <footer>
            <button
              disabled={busy || page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Trang trước
            </button>
            <span aria-live="polite">
              Đã lưu: {course.visitedPageIds.length}/{course.pages.length} trang
            </span>
            <button disabled={busy} onClick={viewed}>
              {busy
                ? "Đang lưu…"
                : page === course.pages.length - 1
                  ? "Đã xem trang cuối"
                  : "Lưu và sang trang tiếp →"}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
