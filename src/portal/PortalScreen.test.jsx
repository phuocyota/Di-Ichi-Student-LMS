import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  act as reactAct,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortalProvider } from "./PortalContext.jsx";
import { PortalScreen } from "./PortalScreen.jsx";
import { usePortal } from "./portalStore.js";

const empty = () => ({
  profile: {
    id: "student-1",
    userId: "user-1",
    name: "API User",
    email: "api@test.local",
    userType: "STUDENT",
  },
  classes: [],
  courses: [],
  students: [],
  enrollments: [],
  schedules: [],
  homework: [],
  submissions: [],
  scores: [],
  certificates: [],
  records: [],
  notifications: [],
  documents: [],
  classDocuments: [],
});
const ok = (data) => ({
  ok: true,
  status: 200,
  json: async () => ({ success: true, data }),
});
function Probe() {
  const { reload, act } = usePortal();
  return (
    <>
      <a href="/profile">Navigate away</a>
      <button onClick={() => reload()}>Reload snapshot</button>
      <button onClick={() => act("/notifications/n/read", { method: "PATCH" })}>
        Force conflicting mutation
      </button>
    </>
  );
}
function mount(mode, extra = null) {
  return render(
    <MemoryRouter>
      <PortalProvider>
        <PortalScreen mode={mode} />
        {extra}
      </PortalProvider>
    </MemoryRouter>,
  );
}
beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => null),
    removeItem: vi.fn(),
  });
  vi.stubGlobal("sessionStorage", {
    getItem: vi.fn(() => null),
    removeItem: vi.fn(),
  });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(empty())));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("API portal screens", () => {
  it.each(
    [
      "dashboard",
      "classes",
      "courses",
      "schedules",
      "homework",
      "grading",
      "quiz",
      "exam",
      "lesson",
      "material",
      "progress",
      "certificates",
      "achievements",
      "profile",
    ].flatMap((mode) => ["TEACHER", "STUDENT"].map((role) => [mode, role])),
  )(
    "renders %s for %s with an empty API response without fixtures or crashes",
    async (mode, role) => {
      const data = empty();
      data.profile.userType = role;
      fetch.mockResolvedValue(ok(data));
      mount(mode);
      await waitFor(() =>
        expect(screen.queryByText("Đang tải dữ liệu…")).not.toBeInTheDocument(),
      );
      expect(fetch.mock.calls[0][0]).toMatch(/\/portal\/snapshot$/);
      expect(
        screen.queryByText(
          /Minh Anh|Cô Linh|Explorer English|Past Simple Story/,
        ),
      ).not.toBeInTheDocument();
    },
  );
  it("shows a retryable error and never falls back to demo data", async () => {
    fetch.mockRejectedValue(new Error("API unavailable"));
    mount("dashboard");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "API unavailable",
    );
    expect(screen.queryByText("API User")).not.toBeInTheDocument();
    fetch.mockResolvedValue(ok(empty()));
    fireEvent.click(screen.getByText("Thử lại"));
    expect(await screen.findByText("Tổng quan học tập")).toBeInTheDocument();
  });
  it("submits homework text to the API and displays the reloaded submission", async () => {
    const data = empty();
    data.homework = [
      {
        id: "homework-1",
        classId: "class-1",
        title: "API Homework",
        deadline: "2027-01-01",
        status: "assigned",
      },
    ];
    fetch.mockImplementation(async (url, options) => {
      if (options.method === "POST") {
        expect(url).toMatch(/\/homework\/homework-1\/submissions$/);
        expect(JSON.parse(options.body)).toEqual({
          fileIds: [],
          note: "My persisted answer",
        });
        data.submissions = [
          {
            id: "submission-1",
            homeworkId: "homework-1",
            submittedAt: "2026-10-29",
          },
        ];
        data.records = [
          {
            id: "meta-1",
            kind: "submission-files",
            parentId: "submission-1",
            content: { text: "My persisted answer" },
          },
        ];
        return ok({ id: "submission-1" });
      }
      return ok(structuredClone(data));
    });
    mount("homework");
    fireEvent.change(await screen.findByLabelText("Bài làm"), {
      target: { value: "My persisted answer" },
    });
    fireEvent.click(screen.getByText("Gửi bài cho giáo viên"));
    expect(await screen.findByText("My persisted answer")).toBeInTheDocument();
    expect(
      screen.getByText("Đang chờ giáo viên chấm/trả bài."),
    ).toBeInTheDocument();
  });
  function resubmissionData(count = 1) {
    const data = empty();
    data.homework = [
      {
        id: "hw",
        classId: "class-1",
        title: "Resubmit",
        deadline: "2027-01-01",
        status: "assigned",
      },
    ];
    data.submissions = [
      { id: "sub", homeworkId: "hw", submittedAt: "2026-11-01" },
    ];
    data.files = Array.from({ length: count }, (_, i) => ({
      id: `old-${i}`,
      fileName: `old-${i}.txt`,
    }));
    data.records = [
      {
        id: "meta",
        kind: "submission-files",
        parentId: "sub",
        content: { text: "X", fileIds: data.files.map((f) => f.id) },
      },
    ];
    return data;
  }
  it("preloads the existing answer and removes old files while uploading three files with one snapshot reload", async () => {
    const data = resubmissionData(2);
    let upload = 0;
    fetch.mockImplementation(async (url, options) => {
      if (url.endsWith("/files")) return ok({ id: `new-${++upload}` });
      if (options.method === "POST") {
        const body = JSON.parse(options.body);
        expect(body).toEqual({
          note: "X",
          fileIds: ["old-1", "new-1", "new-2", "new-3"],
        });
        data.records[0].content = { ...body, text: body.note };
        return ok({ id: "sub" });
      }
      return ok(structuredClone(data));
    });
    mount("homework");
    expect(await screen.findByLabelText("Bài làm")).toHaveValue("X");
    fireEvent.click(screen.getByRole("button", { name: "Gỡ tệp old-0.txt" }));
    fireEvent.change(screen.getByLabelText(/Tệp đính kèm/), {
      target: {
        files: [1, 2, 3].map((i) => new File(["bytes"], `new-${i}.txt`)),
      },
    });
    const before = fetch.mock.calls.filter(([url]) =>
      url.endsWith("/snapshot"),
    ).length;
    fireEvent.click(screen.getByRole("button", { name: "Nộp lại bài" }));
    await screen.findByText("Đã lưu thành công");
    expect(upload).toBe(3);
    expect(
      fetch.mock.calls.filter(([url]) => url.endsWith("/snapshot")).length -
        before,
    ).toBe(1);
    expect(screen.getByLabelText("Bài làm")).toHaveValue("X");
    expect(
      screen.queryByRole("button", { name: "Tải old-0.txt" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tải old-1.txt" }),
    ).toBeInTheDocument();
  });
  it("blocks more than ten total files without uploading or submitting", async () => {
    fetch.mockResolvedValue(ok(resubmissionData(9)));
    mount("homework");
    await screen.findByLabelText("Bài làm");
    fireEvent.change(screen.getByLabelText(/Tệp đính kèm/), {
      target: { files: [new File(["a"], "a.txt"), new File(["b"], "b.txt")] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "không được vượt quá 10",
    );
    expect(screen.getByRole("button", { name: "Nộp lại bài" })).toBeDisabled();
    fireEvent.submit(screen.getByLabelText("Bài làm").closest("form"));
    expect(
      fetch.mock.calls.filter(([, opts]) => opts.method === "POST"),
    ).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Gỡ tệp old-0.txt" }));
    expect(screen.getByRole("button", { name: "Nộp lại bài" })).toBeEnabled();
  });
  it("keeps edited text and uploaded files after an upload failure for retry", async () => {
    const data = resubmissionData(0);
    let uploads = 0;
    fetch.mockImplementation(async (url, options) => {
      if (url.endsWith("/files")) {
        uploads++;
        if (uploads === 2) throw new Error("Upload thất bại");
        return ok({ id: `new-${uploads}` });
      }
      if (options.method === "POST") return ok({ id: "sub" });
      return ok(structuredClone(data));
    });
    mount("homework");
    fireEvent.change(await screen.findByLabelText("Bài làm"), {
      target: { value: "Draft edit" },
    });
    fireEvent.change(screen.getByLabelText(/Tệp đính kèm/), {
      target: { files: [new File(["a"], "a.txt"), new File(["b"], "b.txt")] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Nộp lại bài" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Upload thất bại",
    );
    expect(screen.getByLabelText("Bài làm")).toHaveValue("Draft edit");
    expect(
      fetch.mock.calls.filter(([url]) => url.endsWith("/submissions")),
    ).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Nộp lại bài" }));
    await screen.findByText("Đã lưu thành công");
    expect(uploads).toBe(3);
    const call = fetch.mock.calls.find(([url]) => url.endsWith("/submissions"));
    expect(JSON.parse(call[1].body)).toEqual({
      fileIds: ["new-1", "new-3"],
      note: "Draft edit",
    });
  });
  it("holds the global lock throughout upload A, blocks submission B and other mutations, then allows an explicit retry", async () => {
    const data = resubmissionData(0);
    data.homework.push({
      ...data.homework[0],
      id: "hw-b",
      title: "Homework B",
    });
    let finishUpload;
    const pendingUpload = new Promise((resolve) => {
      finishUpload = resolve;
    });
    const submitted = [];
    fetch.mockImplementation(async (url, opts) => {
      if (url.endsWith("/files")) return pendingUpload;
      if (url.endsWith("/submissions")) {
        submitted.push(url);
        return ok({ id: "saved" });
      }
      return ok(structuredClone(data));
    });
    mount("homework", <Probe />);
    await screen.findByText("Resubmit");
    const a = within(screen.getByText("Resubmit").closest("article"));
    const b = within(screen.getByText("Homework B").closest("article"));
    fireEvent.change(b.getByLabelText("Bài làm"), {
      target: { value: "Draft B" },
    });
    fireEvent.change(a.getByLabelText(/Tệp đính kèm/), {
      target: { files: [new File(["a"], "large.txt")] },
    });
    fireEvent.click(a.getByRole("button", { name: "Nộp lại bài" }));
    await waitFor(() =>
      expect(fetch.mock.calls.some(([url]) => url.endsWith("/files"))).toBe(
        true,
      ),
    );
    expect(
      b.getByRole("button", { name: "Gửi bài cho giáo viên" }),
    ).toBeDisabled();
    expect(b.getByLabelText("Bài làm")).toBeDisabled();
    expect(screen.getByLabelText("Lọc lớp học")).toBeDisabled();
    expect(screen.getByLabelText("Tìm kiếm")).toBeDisabled();
    const navigation = createEvent.click(screen.getByText("Navigate away"));
    fireEvent(screen.getByText("Navigate away"), navigation);
    expect(navigation.defaultPrevented).toBe(true);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "trước khi chuyển trang",
    );
    const unload = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    // Even a programmatically forced submit/act cannot silently acquire the lock.
    fireEvent.submit(b.getByLabelText("Bài làm").closest("form"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Bản nháp được giữ lại",
    );
    fireEvent.click(screen.getByText("Force conflicting mutation"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Vui lòng chờ hoàn tất rồi thử lại",
    );
    expect(submitted).toEqual([]);
    expect(
      fetch.mock.calls.some(([url]) => url.endsWith("/notifications/n/read")),
    ).toBe(false);
    await reactAct(async () => finishUpload(ok({ id: "uploaded-a" })));
    await screen.findByText("Đã lưu thành công");
    expect(submitted).toHaveLength(1);
    expect(submitted[0]).toMatch(/homework\/hw\/submissions$/);
    expect(b.getByLabelText("Bài làm")).toHaveValue("Draft B");
    fireEvent.click(b.getByRole("button", { name: "Gửi bài cho giáo viên" }));
    await waitFor(() => expect(submitted).toHaveLength(2));
    expect(submitted[1]).toMatch(/homework\/hw-b\/submissions$/);
  });
  it("shows names for successful and pending uploads and clears the native input on failure", async () => {
    const data = resubmissionData(0);
    let uploads = 0;
    fetch.mockImplementation(async (url) => {
      if (url.endsWith("/files")) {
        if (++uploads === 1) return ok({ id: "opaque-upload-id" });
        throw new Error("Upload thứ hai thất bại");
      }
      return ok(structuredClone(data));
    });
    mount("homework");
    const input = await screen.findByLabelText(/Tệp đính kèm/);
    fireEvent.change(input, {
      target: {
        files: [
          new File(["a"], "answer-a.txt"),
          new File(["b"], "answer-b.txt"),
        ],
      },
    });
    Object.defineProperty(input, "value", {
      writable: true,
      configurable: true,
      value: "C:\fakepath\answer-a.txt",
    });
    fireEvent.click(screen.getByRole("button", { name: "Nộp lại bài" }));
    await screen.findByRole("alert");
    expect(
      screen.getByRole("button", { name: "Gỡ tệp answer-a.txt" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Gỡ tệp chờ tải answer-b.txt" }),
    ).toBeInTheDocument();
    expect(input.value).toBe("");
    expect(screen.getByLabelText("Bài làm")).toHaveValue("X");
  });
  it("refreshes a pristine form when a submission changes in another session", async () => {
    const data = resubmissionData(1);
    fetch.mockImplementation(async () => ok(structuredClone(data)));
    mount("homework", <Probe />);
    expect(await screen.findByLabelText("Bài làm")).toHaveValue("X");
    data.submissions[0].submittedAt = "2026-11-12T14:00:00Z";
    data.records[0].content = { text: "Other device", fileIds: ["new-remote"] };
    data.files = [{ id: "new-remote", fileName: "remote.txt" }];
    fireEvent.click(screen.getByText("Reload snapshot"));
    await waitFor(() =>
      expect(screen.getByLabelText("Bài làm")).toHaveValue("Other device"),
    );
    expect(
      screen.getByRole("button", { name: "Gỡ tệp remote.txt" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Gỡ tệp old-0.txt" }),
    ).not.toBeInTheDocument();
  });
  it("preserves dirty drafts on remote changes and requires a choice before overwriting", async () => {
    const data = resubmissionData(1);
    fetch.mockImplementation(async () => ok(structuredClone(data)));
    mount("homework", <Probe />);
    fireEvent.change(await screen.findByLabelText("Bài làm"), {
      target: { value: "Local draft" },
    });
    data.submissions[0].submittedAt = "2026-11-12T14:00:00Z";
    data.records[0].content = { text: "Remote answer", fileIds: [] };
    fireEvent.click(screen.getByText("Reload snapshot"));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Bản nháp của bạn được giữ lại",
    );
    expect(screen.getByLabelText("Bài làm")).toHaveValue("Local draft");
    expect(screen.getByRole("button", { name: "Nộp lại bài" })).toBeDisabled();
    fireEvent.click(screen.getByText("Tiếp tục với bản nháp của tôi"));
    expect(screen.getByLabelText("Bài làm")).toHaveValue("Local draft");
    expect(screen.getByRole("button", { name: "Nộp lại bài" })).toBeEnabled();
    data.submissions[0].submittedAt = "2026-11-12T15:00:00Z";
    fireEvent.click(screen.getByText("Reload snapshot"));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByText("Dùng bài nộp mới"));
    expect(screen.getByLabelText("Bài làm")).toHaveValue("Remote answer");
    expect(
      screen.queryByRole("button", { name: "Gỡ tệp old-0.txt" }),
    ).not.toBeInTheDocument();
  });
  it("keeps the draft and exposes a submission error so the user can retry", async () => {
    const data = resubmissionData(0);
    fetch.mockImplementation(async (url, opts) => {
      if (opts.method === "POST")
        return {
          ok: false,
          status: 500,
          json: async () => ({ message: "Nộp bài thất bại" }),
        };
      return ok(structuredClone(data));
    });
    mount("homework");
    fireEvent.change(await screen.findByLabelText("Bài làm"), {
      target: { value: "Keep this draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Nộp lại bài" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Nộp bài thất bại",
    );
    expect(screen.getByLabelText("Bài làm")).toHaveValue("Keep this draft");
    expect(screen.getByRole("button", { name: "Nộp lại bài" })).toBeEnabled();
  });
  it("shows API overview counts, sorts upcoming lessons and excludes submitted or inactive homework", async () => {
    const data = empty();
    const later = (hours) =>
      new Date(Date.now() + hours * 3600000).toISOString();
    data.classes = [
      { id: "c1", name: "Lớp sớm" },
      { id: "c2", name: "Lớp muộn" },
    ];
    data.schedules = [
      {
        id: "later",
        classId: "c2",
        startAt: later(48),
        endAt: later(49),
        status: "upcoming",
      },
      {
        id: "cancelled",
        classId: "c2",
        startAt: later(1),
        endAt: later(2),
        status: "cancelled",
      },
      {
        id: "earlier",
        classId: "c1",
        startAt: later(24),
        endAt: later(25),
        status: "upcoming",
      },
      {
        id: "past",
        classId: "c2",
        startAt: later(-2),
        endAt: later(-1),
        status: "completed",
      },
    ];
    data.homework = [
      {
        id: "todo",
        classId: "c1",
        title: "Bài đang chờ",
        deadline: later(30),
        status: "assigned",
      },
      {
        id: "submitted",
        classId: "c1",
        title: "Bài đã nộp",
        deadline: later(20),
        status: "assigned",
      },
      {
        id: "closed",
        classId: "c1",
        title: "Bài đã đóng",
        deadline: later(10),
        status: "closed",
      },
    ];
    data.submissions = [{ id: "sub", homeworkId: "submitted" }];
    data.records = [
      { id: "progress-1", kind: "progress", content: { percent: 100 } },
    ];
    fetch.mockResolvedValue(ok(data));
    mount("dashboard");
    expect(
      await screen.findByRole("heading", { name: "Tổng quan học tập" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Chào API User/ }),
    ).toBeInTheDocument();
    const tasks = within(
      screen.getByRole("region", { name: "Bài tập cần nộp" }),
    );
    expect(tasks.getByText("Bài đang chờ")).toBeInTheDocument();
    expect(tasks.queryByText("Bài đã nộp")).not.toBeInTheDocument();
    expect(tasks.queryByText("Bài đã đóng")).not.toBeInTheDocument();
    const schedule = within(
      screen.getByRole("region", { name: "Lịch học của bạn" }),
    );
    expect(
      schedule.getAllByRole("heading", { level: 3 }).map((n) => n.textContent),
    ).toEqual(["Lớp sớm", "Lớp muộn"]);
    expect(screen.getByRole("link", { name: "Vào học" })).toHaveAttribute(
      "href",
      "/lessons",
    );
    expect(
      screen.queryByRole("combobox", { name: "Lọc lớp học" }),
    ).not.toBeInTheDocument();
  });
  it("expands real overview notifications and marks them read with the existing API", async () => {
    const data = empty();
    data.notifications = [1, 2, 3, 4].map((id) => ({
      id: `n-${id}`,
      title: `Thông báo thật ${id}`,
      content: "Nội dung API",
      createdAt: new Date().toISOString(),
      readAt: null,
    }));
    fetch.mockImplementation(async (url, opts) => {
      if (opts.method === "PATCH") {
        expect(url).toMatch(/notifications\/n-1\/read$/);
        data.notifications[0].readAt = new Date().toISOString();
        return ok({ id: "n-1" });
      }
      return ok(structuredClone(data));
    });
    mount("dashboard");
    await screen.findByText("Thông báo thật 1");
    expect(screen.queryByText("Thông báo thật 4")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Xem tất cả thông báo"));
    expect(screen.getByText("Thông báo thật 4")).toBeInTheDocument();
    fireEvent.click(
      screen.getAllByRole("button", { name: "Đánh dấu đã đọc" })[0],
    );
    await screen.findByText("Đã lưu thành công");
    expect(
      screen.getAllByRole("button", { name: "Đánh dấu đã đọc" }),
    ).toHaveLength(3);
    fireEvent.click(screen.getByText("Thu gọn thông báo"));
    expect(screen.queryByText("Thông báo thật 4")).not.toBeInTheDocument();
    expect(
      screen.getByText("Không có bài tập đang chờ nộp"),
    ).toBeInTheDocument();
    expect(screen.getByText("Chưa có lịch học sắp tới")).toBeInTheDocument();
  });
  it("includes teacher exams in the student quiz list", async () => {
    const data = empty();
    data.records = [
      {
        id: "exam-1",
        kind: "exam",
        content: { title: "Exam from teacher", duration: 15, questions: [] },
      },
    ];
    fetch.mockResolvedValue(ok(data));
    mount("quiz");
    expect(await screen.findByText("Exam from teacher")).toBeInTheDocument();
  });
});
