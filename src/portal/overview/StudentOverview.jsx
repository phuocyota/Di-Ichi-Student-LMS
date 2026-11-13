import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCheck,
  Clock3,
  FileText,
  GraduationCap,
  Bell,
  Play,
  Layers3,
  BarChart3,
  FolderOpen,
  Trophy,
  Video,
} from "lucide-react";
import { usePortal } from "../portalStore.js";
import "./student-overview.css";

const shortcuts = [
  ["/lessons", "Bài học", "Khám phá nội dung trên lớp", BookOpen, "orange"],
  ["/homework", "Bài tập", "Luyện tập và nộp bài", FileText, "blue"],
  ["/quiz", "Quiz & đề thi", "Thử sức với kiến thức đã học", Layers3, "purple"],
  [
    "/materials",
    "Tài liệu",
    "Tài liệu dành cho lớp của bạn",
    FolderOpen,
    "green",
  ],
  [
    "/progress",
    "Kết quả học tập",
    "Theo dõi kết quả của mình",
    BarChart3,
    "blue",
  ],
  [
    "/achievements",
    "Thành tích",
    "Nhìn lại những gì đã đạt được",
    Trophy,
    "orange",
  ],
];
const format = (value, options) =>
  new Intl.DateTimeFormat("vi-VN", options).format(new Date(value));

export function StudentOverview({ notifications }) {
  const { data, busy, reload } = usePortal();
  const now = Date.now();
  const completed = data.records.filter(
    (r) => r.kind === "progress" && r.content.percent === 100,
  ).length;
  const submittedIds = new Set(data.submissions.map((s) => s.homeworkId));
  const pending = data.homework
    .filter(
      (h) =>
        h.status === "assigned" &&
        (h.lessonPlanId
          ? !h.lessonProgress ||
            h.lessonProgress.answered < h.lessonProgress.total
          : !submittedIds.has(h.id)),
    )
    .sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
  const upcoming = data.schedules
    .filter((s) => s.status !== "cancelled" && Date.parse(s.endAt) > now)
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
    .slice(0, 3);
  const className = (id) =>
    data.classes.find((c) => c.id === id)?.name || "Lớp học";
  const stats = [
    [data.classes.length, "Lớp học của bạn", GraduationCap, "orange"],
    [pending.length, "Bài tập cần nộp", FileText, "blue"],
    [completed, "Bài học hoàn thành", CheckCheck, "green"],
    [
      data.notifications.filter((n) => !n.readAt).length,
      "Thông báo chưa đọc",
      Bell,
      "purple",
    ],
  ];
  return (
    <section className="student-overview" aria-labelledby="overview-title">
      <div className="overview-heading">
        <div>
          <p className="overview-eyebrow">GÓC HỌC TẬP CỦA BẠN</p>
          <h1 id="overview-title">Tổng quan học tập</h1>
        </div>
        <button
          className="overview-refresh"
          disabled={busy}
          onClick={() => reload().catch(() => {})}
        >
          <CalendarDays size={16} aria-hidden="true" /> Làm mới
        </button>
      </div>
      <section className="overview-welcome" aria-label="Chào mừng học viên">
        <div className="overview-welcome-copy">
          <span className="overview-welcome-tag">
            <span /> Mỗi ngày, một bước tiến
          </span>
          <h2>
            Chào {data.profile.name || "bạn"}{" "}
            <span className="overview-wave" aria-hidden="true">
              ✦
            </span>
          </h2>
          <p>
            Một buổi học mới, một điều hay để khám phá.
            <br />
            Cùng tiếp tục hành trình học tập của bạn nhé!
          </p>
          <div className="overview-welcome-actions">
              <Link className="overview-primary-link" to="/online">
                <Video size={18} aria-hidden="true" /> Vào lớp online
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            <Link className="overview-primary-link" to="/lessons">
              <Play size={16} aria-hidden="true" /> Vào học{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="overview-text-link" to="/homework">
              Xem bài tập <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="overview-book-art" aria-hidden="true">
          <span className="overview-art-orbit" />
          <span className="overview-art-small">
            <GraduationCap size={25} />
          </span>
          <div className="overview-art-book">
            <span className="overview-art-label">
              DI-ICHI
              <br />
              <strong>
                Learning
                <br />
                every day.
              </strong>
            </span>
            <BookOpen size={40} strokeWidth={1.5} />
            <span className="overview-art-lines" />
          </div>
          <span className="overview-art-star">✦</span>
          <span className="overview-art-dot" />
        </div>
      </section>
      <div className="overview-stats" aria-label="Tình hình học tập">
        {stats.map(([count, label, Icon, tone]) => (
          <article className="overview-stat" key={label}>
            <span className={`overview-icon is-${tone}`}>
              <Icon size={21} aria-hidden="true" />
            </span>
            <div>
              <strong>{count}</strong>
              <p>{label}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="overview-columns">
        <div className="overview-main-column">
          <section
            className="overview-panel"
            aria-labelledby="overview-schedule-title"
          >
            <div className="overview-section-heading">
              <div>
                <p className="overview-eyebrow">SẮP TỚI</p>
                <h2 id="overview-schedule-title">Lịch học của bạn</h2>
              </div>
              <Link className="overview-text-link" to="/online">
                Xem lịch học <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            {upcoming.length ? (
              <div className="overview-schedules">
                {upcoming.map((s, index) => (
                  <article
                    className={`overview-session ${index === 0 ? "is-next" : ""}`}
                    key={s.id}
                  >
                    <div className="overview-date-chip">
                      <span>
                        THÁNG {format(s.startAt, { month: "numeric" })}
                      </span>
                      <strong>{format(s.startAt, { day: "2-digit" })}</strong>
                    </div>
                    <div className="overview-session-copy">
                      <span className="overview-session-label">
                        {index === 0
                          ? "Buổi học gần nhất"
                          : format(s.startAt, { weekday: "long" })}
                      </span>
                      <h3>{className(s.classId)}</h3>
                      <p>
                        <Clock3 size={13} aria-hidden="true" />
                        {format(s.startAt, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {format(s.endAt, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {s.room?.name && <span> · {s.room.name}</span>}
                      </p>
                    </div>
                    <CalendarDays
                      size={19}
                      className="overview-session-symbol"
                      aria-hidden="true"
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="overview-empty">
                <CalendarDays size={28} aria-hidden="true" />
                <h3>Chưa có lịch học sắp tới</h3>
                <p>Lịch học của bạn sẽ xuất hiện tại đây khi được cập nhật.</p>
              </div>
            )}
          </section>
          <section
            className="overview-panel overview-shortcuts-panel"
            aria-labelledby="overview-tools-title"
          >
            <div className="overview-section-heading">
              <div>
                <p className="overview-eyebrow">KHÁM PHÁ</p>
                <h2 id="overview-tools-title">Bạn muốn học gì hôm nay?</h2>
              </div>
            </div>
            <div className="overview-shortcuts">
              {shortcuts.map(([path, title, description, Icon, tone]) => (
                <Link to={path} className="overview-shortcut" key={path}>
                  <span className={`overview-icon is-${tone}`}>
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside className="overview-side-column">
          <section
            className="overview-panel"
            aria-labelledby="overview-homework-title"
          >
            <div className="overview-section-heading">
              <div>
                <p className="overview-eyebrow">ĐỪNG BỎ LỠ</p>
                <h2 id="overview-homework-title">Bài tập cần nộp</h2>
              </div>
              <span className="overview-count">{pending.length}</span>
            </div>
            {pending.length ? (
              <div className="overview-homework-list">
                {pending.slice(0, 3).map((h) => (
                  <Link
                    className="overview-homework-item"
                    to="/homework"
                    key={h.id}
                  >
                    <span className="overview-homework-marker">
                      <FileText size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="overview-item-caption">
                        {className(h.classId)}
                      </span>
                      <h3>{h.title}</h3>
                      <p
                        className={
                          Date.parse(h.deadline) < now ? "is-overdue" : ""
                        }
                      >
                        {Date.parse(h.deadline) < now
                          ? "Đã quá hạn · "
                          : "Hạn nộp · "}
                        {format(h.deadline, {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="overview-empty is-small">
                <CheckCheck size={27} aria-hidden="true" />
                <h3>Không có bài tập đang chờ nộp</h3>
                <p>Bạn có thể ôn lại bài học hoặc xem các bài đã nộp.</p>
              </div>
            )}
            <Link className="overview-panel-footer" to="/homework">
              Đi đến bài tập <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
          <section
            className="overview-panel overview-notifications"
            aria-label="Thông báo học tập"
          >
            {notifications}
          </section>
        </aside>
      </div>
    </section>
  );
}
