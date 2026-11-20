import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "../services/apiClient.js";
import { portalRequest } from "../services/portalApi.js";
import { PORTAL_SECTIONS, loadPortal, mergePortal, sectionsForChange } from "./portalLoaders.js";

vi.mock("../services/apiClient.js", () => ({ apiRequest: vi.fn() }));
vi.mock("../services/portalApi.js", () => ({ portalRequest: vi.fn() }));

const paths = () => apiRequest.mock.calls.map(([url]) => url.split("?")[0]).sort();
beforeEach(() => {
  vi.clearAllMocks();
  apiRequest.mockImplementation(async (url) => {
    const page = Number(new URL(url, "http://test").searchParams.get("page"));
    const many = url.startsWith("/notification?");
    return {
      page,
      total: many ? 150 : 1,
      data: many
        ? Array.from({ length: page === 1 ? 100 : 50 }, (_, i) => ({ id: `n${page}-${i}`, createdAt: "2026-01-01" }))
        : [{ id: url.split("?")[0].slice(1), fileId: "f1", fileName: "a.pdf" }],
    };
  });
  portalRequest.mockImplementation(async (path) =>
    path === "/profile" ? { name: "HS", userType: "STUDENT" } : { records: [{ id: "r1" }], files: [{ id: "f2", fileName: "b.pdf" }] },
  );
});

describe("Cổng học viên gọi route GET tương ứng", () => {
  it("mỗi phần gọi đúng route CRUD hoặc route portal, đọc hết các trang", async () => {
    const data = await loadPortal(PORTAL_SECTIONS, { base: true });
    expect([...new Set(paths())]).toEqual(
      ["/class", "/course", "/student", "/enrollment", "/schedule", "/homework", "/homework-submission", "/score", "/student-certificate", "/notification", "/document", "/class-document"].sort(),
    );
    expect(portalRequest.mock.calls.map(([path]) => path).sort()).toEqual(["/profile", "/records"]);
    expect(apiRequest).toHaveBeenCalledWith(expect.stringContaining("/enrollment?isCurrent=true&page=1&size=100"), expect.anything());
    // 150 thông báo qua 2 trang, chỉ giữ 100 mới nhất như cổng cũ.
    expect(apiRequest.mock.calls.filter(([url]) => url.startsWith("/notification?"))).toHaveLength(2);
    expect(data.notifications).toHaveLength(100);
    expect(data.profile.name).toBe("HS");
    expect(data.files.map((f) => f.id).sort()).toEqual(["f1", "f1", "f2"]);
  });

  it("chỉ tải lại phần bị ảnh hưởng và gộp tệp theo id", async () => {
    expect(sectionsForChange({ resources: ["homework-submission"] })).toEqual({ sections: ["submissions"], base: false });
    expect(sectionsForChange({ resources: ["payment"] })).toEqual({ sections: [], base: false });
    expect(sectionsForChange({ resources: ["class"] })).toEqual({ sections: PORTAL_SECTIONS, base: true });
    await loadPortal(["submissions"], { base: false });
    expect(paths()).toEqual(["/homework-submission"]);
    expect(portalRequest).not.toHaveBeenCalled();
    const merged = mergePortal({ homework: [{ id: "h" }], files: [{ id: "f1", fileName: "a.pdf" }] }, { submissions: [], files: [{ id: "f1" }] });
    expect(merged.homework).toEqual([{ id: "h" }]);
    expect(merged.files).toEqual([{ id: "f1", fileName: "a.pdf" }]);
  });
});
