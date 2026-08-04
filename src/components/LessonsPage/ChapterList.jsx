import { BookOpen } from 'lucide-react';
import Card from '../common/Card.jsx';
import SectionTitle from '../common/SectionTitle.jsx';
import LessonItem from './LessonItem.jsx';
import { lessons } from '../../datas/lessonData.js';

function ChapterList() {
  return (
    <Card>
      <SectionTitle icon={BookOpen} title="Danh sách chương" />
      <div className="mt-5 space-y-4">
        {lessons.map((chapter, chapterIndex) => (
          <div key={chapter.chapter} className="rounded-3xl bg-orange-50 p-4">
            <h3 className="text-lg font-black text-slate-900">{chapter.chapter}</h3>
            <div className="mt-3 space-y-2">
              {chapter.items.map((lesson, lessonIndex) => (
                <LessonItem key={lesson} lesson={lesson} active={chapterIndex === 1 && lessonIndex === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ChapterList;
