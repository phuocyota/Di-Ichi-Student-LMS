import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { getAccessToken, clearAccessToken } from "../auth/authStorage.js";
import { portalRequest } from "./portalApi.js";
vi.mock("../auth/authStorage.js", () => ({
  getAccessToken: vi.fn(() => "test-token"),
  clearAccessToken: vi.fn(),
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => vi.unstubAllGlobals());
const response = (payload, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => payload,
});
it("uses the same authenticated client for JSON and multipart, with caller abort signals", async () => {
  fetch.mockResolvedValue(response({ success: true, data: { id: "saved" } }));
  const signal = new AbortController().signal;
  await expect(
    portalRequest("/homework/h/submissions", {
      method: "POST",
      body: { note: "X", fileIds: [] },
      signal,
    }),
  ).resolves.toEqual({ id: "saved" });
  expect(fetch.mock.calls[0][1]).toMatchObject({
    headers: {
      Authorization: "Bearer test-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note: "X", fileIds: [] }),
    signal,
  });
  const form = new FormData();
  form.append("file", new File(["bytes"], "answer.txt"));
  await portalRequest("/files", { method: "POST", body: form });
  expect(fetch.mock.calls[1][1].body).toBe(form);
  expect(fetch.mock.calls[1][1].headers).not.toHaveProperty("Content-Type");
  expect(getAccessToken).toHaveBeenCalledTimes(2);
});
it("downloads bytes and the encoded filename for both existing consumers", async () => {
  const blob = new Blob(["answer"]);
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    blob: async () => blob,
    headers: new Headers({
      "Content-Disposition": "attachment; filename*=UTF-8''b%C3%A0i.txt",
    }),
  });
  await expect(portalRequest("/files/id", { download: true })).resolves.toEqual(
    { blob, name: "bài.txt" },
  );
});
it("clears the session on 401 using the existing auth gate and preserves the API error", async () => {
  fetch.mockResolvedValue(
    response({ message: "Phiên đăng nhập hết hạn" }, 401),
  );
  await expect(portalRequest("/snapshot")).rejects.toThrow(
    "Phiên đăng nhập hết hạn",
  );
  expect(clearAccessToken).toHaveBeenCalledOnce();
});
it.each([
  [{ success: false, message: ["Lỗi A", "Lỗi B"] }, "Lỗi A; Lỗi B"],
  [null, "Máy chủ trả về dữ liệu không hợp lệ"],
])(
  "rejects failed envelopes and malformed payloads",
  async (payload, message) => {
    fetch.mockResolvedValue(response(payload));
    await expect(portalRequest("/snapshot")).rejects.toThrow(message);
  },
);
