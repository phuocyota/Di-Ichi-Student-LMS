import React from "react";
import { Link } from "react-router-dom";
export default function LessonHomeworkCard({ homework }) {
  const progress = homework.lessonProgress;
  return (
    <div className="portal-card">
      <p>Giáo án · Chấm tự động</p>
      <p>
        {progress
          ? `${progress.answered}/${progress.total} câu đã làm`
          : "Chưa xem bài"}
      </p>
      {progress?.score != null && <p>Điểm tự chấm: {progress.score}/100</p>}
      <Link to={`/homework/${homework.id}/lesson`}>Mở giáo án làm bài</Link>
    </div>
  );
}
