import TaskCard from '../components/cards/TaskCard.jsx';
import PageShell from '../components/common/PageShell.jsx';
import { homework } from '../datas/lmsData.js';

function HomeworkPage() {
  return (
    <PageShell title="Homework" subtitle="Bài tập được trình bày bằng card để dễ xem hạn nộp và trạng thái.">
      <HomeworkGrid />
    </PageShell>
  );
}

function HomeworkGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {homework.map((item) => (
        <TaskCard key={item.title} item={item} action="Nộp bài" />
      ))}
    </div>
  );
}

export default HomeworkPage;
