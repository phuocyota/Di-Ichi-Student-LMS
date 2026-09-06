import '@testing-library/jest-dom/vitest';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OnlineClassGrid from './OnlineClassGrid.jsx';
import { getOnlineSchedules } from '../../services/classroomApi.js';

globalThis.React = React;

let onStarted;
vi.mock('../../services/classroomApi.js', () => ({ getOnlineSchedules: vi.fn() }));
vi.mock('../../hooks/useOnlineScheduleWatcher.js', () => ({
  useOnlineScheduleWatcher: (_ids, callback) => {
    onStarted = callback;
    return true;
  },
}));

describe('OnlineClassGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOnlineSchedules.mockResolvedValue([{
      scheduleId: 'schedule-1',
      className: 'IELTS Online',
      courseName: 'IELTS',
      teacherName: 'Cô Mai',
      startAt: '2026-09-04T10:00:00Z',
      endAt: '2026-09-04T11:00:00Z',
      canJoin: false,
      meetingStarted: false,
      joinReason: 'Giáo viên chưa bắt đầu lớp học',
    }]);
  });

  it('mở nút tham gia ngay khi nhận sự kiện classroom:started', async () => {
    render(<MemoryRouter><OnlineClassGrid /></MemoryRouter>);
    expect(await screen.findByText('Giáo viên chưa bắt đầu lớp học')).toBeInTheDocument();
    act(() => onStarted({ scheduleId: 'schedule-1' }));
    expect(screen.getByRole('link', { name: 'Tham gia' })).toHaveAttribute('href', '/online/schedule-1');
  });
});
