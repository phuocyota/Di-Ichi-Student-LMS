import BackToPreviousButton from '../components/LessonsPage/BackToPreviousButton.jsx';
import ChapterList from '../components/LessonsPage/ChapterList.jsx';
import LessonPlayer from '../components/LessonsPage/LessonPlayer.jsx';
import PageShell from '../components/common/PageShell.jsx';

function LessonsPage() {
  return (
    <PageShell title="Học bài" subtitle="Chọn chương, xem video, đọc nội dung và chuyển sang bài tiếp theo.">
      <BackToPreviousButton />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ChapterList />
        <LessonPlayer />
      </div>
    </PageShell>
  );
}

export default LessonsPage;
