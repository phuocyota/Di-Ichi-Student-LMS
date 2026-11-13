import '@testing-library/jest-dom/vitest';
import React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ClassroomLesson } from './ClassroomLesson.jsx';
globalThis.React = React;
const mock = vi.hoisted(() => ({ get: vi.fn(), answer: vi.fn() }));
vi.mock('../../services/lessonPlanApi.js', () => ({
  getClassLessonPlan: (...args) => mock.get(...args),
  submitLessonAnswer: (...args) => mock.answer(...args),
  downloadPortalImage: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const joinData = { scheduleId: 'schedule', classId: 'class-a' };
const plan = {
  id: 'plan',
  classId: 'class-a',
  title: 'Chào hỏi',
  revision: 3,
  blocks: [
    {
      id: 'b1',
      type: 'text',
      title: 'Nội dung bài học',
      body: 'Xin chào bằng tiếng Nhật',
    },
    {
      id: 'b2',
      type: 'quiz',
      title: 'Câu hỏi',
      body: 'Chọn lời chào',
      options: ['こんにちは', 'ありがとう'],
      answer: 0,
    },
  ],
};
function fixture() {
  const handlers = new Map();
  const socket = {
    on: vi.fn((event, cb) => handlers.set(event, cb)),
    off: vi.fn(),
    emit: vi.fn(),
  };
  const send = (data) =>
    act(() =>
      handlers.get('lesson:presentation')({
        scheduleId: 'schedule',
        classId: 'class-a',
        data,
      }),
    );
  return { socket, handlers, send };
}
it('theo slide giáo viên, làm quiz thật, giữ câu trả lời khi đổi slide và dừng', async () => {
  mock.get.mockResolvedValue(plan);
  mock.answer.mockResolvedValue({
    answered: 1,
    total: 1,
    correct: 1,
    incorrect: 0,
    answers: [{ blockId: 'b2', values: [0] }],
  });
  const { socket, send } = fixture();
  const onPresent = vi.fn();
  const changed = vi.fn();
  render(
    <ClassroomLesson
      socket={socket}
      connected
      joinData={joinData}
      onPresent={onPresent}
      onPresentationChange={changed}
    />,
  );
  expect(socket.emit).toHaveBeenCalledWith('lesson:request', {
    scheduleId: 'schedule',
  });
  send({ planId: 'plan', slideIndex: 0, revision: 3 });
  expect(await screen.findByText('Xin chào bằng tiếng Nhật')).toBeVisible();
  expect(screen.getByRole('button', { name: /Slide sau/ })).toBeDisabled();
  send({ planId: 'plan', slideIndex: 1, revision: 3 });
  fireEvent.click(screen.getByRole('radio', { name: /こんにちは/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Kiểm tra đáp án' }));
  await waitFor(() =>
    expect(mock.answer).toHaveBeenCalledWith('plan', {
      revision: 3,
      blockId: 'b2',
      values: [0],
    }),
  );
  send({ planId: 'plan', slideIndex: 0, revision: 3 });
  send({ planId: 'plan', slideIndex: 1, revision: 3 });
  expect(screen.getByRole('radio', { name: /こんにちは/ })).toBeChecked();
  expect(mock.get).toHaveBeenCalledTimes(1);
  expect(onPresent).toHaveBeenCalledTimes(1);
  expect(changed).toHaveBeenCalledWith(true);
  send(null);
  expect(changed).toHaveBeenLastCalledWith(false);
  expect(screen.getByText(/Chờ giáo viên chọn giáo án/)).toBeInTheDocument();
});
it('không tải giáo án của phòng khác, hiển thị lỗi và cho phép thử lại', async () => {
  const { socket, handlers, send } = fixture();
  mock.get
    .mockRejectedValueOnce(new Error('Không có quyền xem'))
    .mockResolvedValue(plan);
  render(<ClassroomLesson socket={socket} connected joinData={joinData} />);
  act(() =>
    handlers.get('lesson:presentation')({
      scheduleId: 'other',
      classId: 'class-a',
      data: { planId: 'secret', slideIndex: 0, revision: 3 },
    }),
  );
  expect(mock.get).not.toHaveBeenCalled();
  send({ planId: 'plan', slideIndex: 0, revision: 3 });
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Không có quyền xem',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
  expect(await screen.findByText('Xin chào bằng tiếng Nhật')).toBeVisible();
});
it('không hiển thị nội dung khác lớp dù response trả về thành công', async () => {
  const { socket, send } = fixture();
  mock.get.mockResolvedValue({ ...plan, classId: 'class-b' });
  render(<ClassroomLesson socket={socket} connected joinData={joinData} />);
  send({ planId: 'plan', slideIndex: 0, revision: 3 });
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'không thuộc lớp học này',
  );
  expect(screen.queryByText('Xin chào bằng tiếng Nhật')).toBeNull();
});
