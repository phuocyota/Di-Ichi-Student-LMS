import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PortalContext } from "../portalStore.js";
import { portalRequest } from "../../services/portalApi.js";
import LessonHomeworkCard from "./LessonHomeworkCard.jsx";
import LessonHomeworkPage from "./LessonHomeworkPage.jsx";
vi.mock("../../services/portalApi.js", () => ({ portalRequest: vi.fn() }));
vi.mock("../../lesson-plans/SlidePresentation.jsx", () => ({
  default: ({ onAnswer, onClose, summary, closeDisabled }) => (
    <div role="dialog">
      <p>{summary}</p>
      <button onClick={() => onAnswer("block-1", [1]).catch(() => {})}>
        Answer question
      </button>
      <button disabled={closeDisabled} onClick={onClose}>
        Close player
      </button>
    </div>
  ),
}));
const initial = {
  firstViewedAt: null,
  total: 2,
  answered: 0,
  correct: 0,
  incorrect: 0,
  score: null,
  answers: [],
};
function mount() {
  const mutate = async (work) => {
    try {
      return await work();
    } catch {
      return null;
    }
  };
  render(
    <MemoryRouter initialEntries={["/homework/hw-1/lesson"]}>
      <PortalContext.Provider value={{ mutate, busy: false }}>
        <Routes>
          <Route
            path="/homework/:homeworkId/lesson"
            element={<LessonHomeworkPage />}
          />
        </Routes>
      </PortalContext.Provider>
    </MemoryRouter>,
  );
}
beforeEach(() => {
  portalRequest.mockReset();
});
afterEach(cleanup);
it("does not record a view from a GET, opens on explicit start and resumes server grading", async () => {
  portalRequest.mockImplementation(async (path) => {
    if (path.endsWith("/open"))
      return { ...initial, firstViewedAt: "2026-11-12T07:00:00Z" };
    if (path.endsWith("/answers"))
      return {
        ...initial,
        firstViewedAt: "2026-11-12T07:00:00Z",
        answered: 1,
        correct: 1,
        score: 50,
      };
    return {
      title: "Homework snapshot",
      revision: 3,
      blocks: [],
      progress: initial,
    };
  });
  mount();
  await screen.findByText("Bắt đầu làm bài");
  expect(portalRequest).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Bắt đầu làm bài"));
  await screen.findByRole("dialog");
  fireEvent.click(screen.getByText("Answer question"));
  await screen.findByText("1/2 câu · 50/100");
  const saved = portalRequest.mock.calls.find(([path]) =>
    path.endsWith("/answers"),
  );
  expect(saved[1].body).toMatchObject({
    revision: 3,
    blockId: "block-1",
    values: [1],
  });
  expect(saved[1].body).not.toHaveProperty("score");
  fireEvent.click(screen.getByText("Close player"));
  expect(screen.getByText("Tiếp tục làm bài")).toBeInTheDocument();
});
it("retries a failed answer with the same idempotency key and keeps the player open", async () => {
  let writes = 0;
  portalRequest.mockImplementation(async (path) => {
    if (path.endsWith("/open"))
      return { ...initial, firstViewedAt: "2026-11-12T07:00:00Z" };
    if (path.endsWith("/answers")) {
      if (++writes === 1) throw new Error("Lost acknowledgement");
      return { ...initial, answered: 1, correct: 1, score: 50 };
    }
    return {
      title: "Homework snapshot",
      revision: 1,
      blocks: [],
      progress: initial,
    };
  });
  mount();
  fireEvent.click(await screen.findByText("Bắt đầu làm bài"));
  fireEvent.click(await screen.findByText("Answer question"));
  await waitFor(() => expect(writes).toBe(1));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Answer question"));
  await screen.findByText("1/2 câu · 50/100");
  const calls = portalRequest.mock.calls.filter(([path]) =>
    path.endsWith("/answers"),
  );
  expect(calls[0][1].body.requestId).toBe(calls[1][1].body.requestId);
});
it("exposes loading failures and retries without marking homework viewed", async () => {
  portalRequest.mockRejectedValueOnce(new Error("Cannot load assignment"));
  mount();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Cannot load assignment",
  );
  portalRequest.mockResolvedValue({
    title: "Homework snapshot",
    revision: 1,
    blocks: [],
    progress: initial,
  });
  fireEvent.click(screen.getByText("Thử lại"));
  await screen.findByText("Bắt đầu làm bài");
  expect(
    portalRequest.mock.calls.some(([path]) => path.endsWith("/open")),
  ).toBe(false);
});

it("distinguishes unviewed homework from a partially answered provisional grade", () => {
  const { rerender } = render(
    <MemoryRouter>
      <LessonHomeworkCard
        homework={{
          id: "hw-1",
          lessonProgress: {
            firstViewedAt: null,
            answered: 0,
            total: 2,
            score: null,
          },
        }}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("Chưa xem bài")).toBeInTheDocument();
  rerender(
    <MemoryRouter>
      <LessonHomeworkCard
        homework={{
          id: "hw-1",
          lessonProgress: {
            firstViewedAt: "2026-11-12",
            answered: 1,
            total: 2,
            score: 50,
          },
        }}
      />
    </MemoryRouter>,
  );
  expect(screen.getByText("1/2 câu đã làm")).toBeInTheDocument();
  expect(screen.getByText(/50\/100.*Tạm tính/)).toBeInTheDocument();
});
