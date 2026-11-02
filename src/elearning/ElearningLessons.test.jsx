import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { it, expect, vi, beforeEach, afterEach } from "vitest";
import ElearningLesson, { ElearningList } from "./ElearningLessons.jsx";
import { portalRequest } from "../services/portalApi.js";
vi.mock("../services/portalApi.js", () => ({ portalRequest: vi.fn() }));
const course = {
  id: "c1",
  title: "Phân số",
  version: 2,
  pages: [
    { id: "p1", title: "Giới thiệu" },
    { id: "p2", title: "Luyện tập" },
  ],
  blocks: [
    {
      id: "b1",
      pageId: "p1",
      type: "text",
      title: "Khám phá",
      body: "Nội dung trang đầu",
    },
    {
      id: "b2",
      pageId: "p2",
      type: "quiz",
      title: "1+1?",
      body: "Chọn đáp án",
      options: ["1", "2"],
      answer: 1,
    },
  ],
  visitedPageIds: [],
};
let visits;
beforeEach(() => {
  visits = [];
  portalRequest.mockReset();
  portalRequest.mockImplementation(async (path, opts) => {
    if (path.endsWith("/visit")) {
      visits = [...new Set([...visits, opts.body.pageId])];
      return { visitedPageIds: visits };
    }
    if (path === "/elearning")
      return {
        items: [
          {
            id: "c1",
            title: "Phân số",
            pageCount: 2,
            visitedPageIds: visits,
            className: "Lớp 4",
          },
        ],
      };
    return { ...course, visitedPageIds: visits };
  });
});
afterEach(cleanup);
function mount() {
  return render(
    <MemoryRouter initialEntries={["/elearning/c1"]}>
      <Routes>
        <Route path="/elearning/:courseId" element={<ElearningLesson />} />
      </Routes>
    </MemoryRouter>,
  );
}
it("opens assigned lessons and records actual server-confirmed page visits", async () => {
  mount();
  await screen.findByRole("heading", { name: "Phân số" });
  expect(screen.getByText("Nội dung trang đầu")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Lưu và sang trang tiếp →" }),
  );
  await screen.findByText("Trang 2/2 · Luyện tập");
  expect(portalRequest).toHaveBeenCalledWith("/elearning/c1/visit", {
    method: "POST",
    body: { version: 2, pageId: "p1" },
  });
  fireEvent.click(screen.getByRole("radio", { name: "B. 2" }));
  fireEvent.click(screen.getByRole("button", { name: "Kiểm tra đáp án" }));
  fireEvent.click(screen.getByRole("button", { name: "← Trang trước" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Lưu và sang trang tiếp →" }),
  );
  await screen.findByText("Trang 2/2 · Luyện tập");
  expect(screen.getByRole("radio", { name: "B. 2" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Đã xem trang cuối" }));
  await screen.findByText("Đã lưu: 2/2 trang");
});
it("resumes from persisted page visits after reopening", async () => {
  visits = ["p1"];
  mount();
  await screen.findByText("Trang 2/2 · Luyện tập");
  expect(screen.getByText("Đã lưu: 1/2 trang")).toBeInTheDocument();
});
it("keeps the current page and truthful progress on save failure", async () => {
  mount();
  await screen.findByRole("heading", { name: "Phân số" });
  portalRequest.mockRejectedValueOnce(new Error("Mất kết nối"));
  fireEvent.click(
    screen.getByRole("button", { name: "Lưu và sang trang tiếp →" }),
  );
  await screen.findByRole("alert");
  expect(screen.getByText("Trang 1/2 · Giới thiệu")).toBeInTheDocument();
  expect(screen.getByText("Đã lưu: 0/2 trang")).toBeInTheDocument();
});
it("lists only the API response with empty and retry states", async () => {
  const view = render(
    <MemoryRouter>
      <ElearningList />
    </MemoryRouter>,
  );
  expect(await screen.findByRole("link", { name: /Phân số/ })).toHaveAttribute(
    "href",
    "/elearning/c1",
  );
  view.unmount();
  portalRequest.mockRejectedValueOnce(new Error("Không tải được"));
  render(
    <MemoryRouter>
      <ElearningList />
    </MemoryRouter>,
  );
  await screen.findByRole("alert");
  portalRequest.mockResolvedValueOnce({ items: [] });
  fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
  await waitFor(() =>
    expect(
      screen.getByText("Chưa có bài e-learning được giao cho lớp của bạn."),
    ).toBeInTheDocument(),
  );
});
