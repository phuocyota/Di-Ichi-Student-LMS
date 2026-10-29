import React from "react";
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChangePasswordForm from "./ChangePasswordForm.jsx";

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => "student-token"),
    removeItem: vi.fn(),
  });
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function fill(confirm = "NewPassword2026!") {
  fireEvent.change(screen.getByLabelText("Mật khẩu hiện tại"), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText("Mật khẩu mới"), {
    target: { value: "NewPassword2026!" },
  });
  fireEvent.change(screen.getByLabelText("Nhập lại mật khẩu mới"), {
    target: { value: confirm },
  });
  fireEvent.click(screen.getByRole("button", { name: "Đổi mật khẩu" }));
}
describe("Student password change", () => {
  it("calls the protected API and clears password fields only after success", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { changed: true } }),
    });
    render(<ChangePasswordForm />);
    fill();
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Đã đổi mật khẩu thành công",
    );
    const [url, options] = fetch.mock.calls[0];
    expect(url).toMatch(/\/auth\/student\/change-password$/);
    expect(options.headers.Authorization).toBe("Bearer student-token");
    expect(JSON.parse(options.body)).toEqual({
      currentPassword: "123456",
      newPassword: "NewPassword2026!",
    });
    expect(options).not.toHaveProperty("keepSessionOn401");
    expect(screen.getByLabelText("Mật khẩu mới")).toHaveValue("");
  });
  it("rejects mismatched confirmation before any API request", async () => {
    render(<ChangePasswordForm />);
    fill("Mismatch");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Mật khẩu xác nhận không khớp",
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("reports an incorrect current password without discarding the login session or claiming success", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Mật khẩu hiện tại không đúng" }),
    });
    render(<ChangePasswordForm />);
    fill();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Mật khẩu hiện tại không đúng",
      ),
    );
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
