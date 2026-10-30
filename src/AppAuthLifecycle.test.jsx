import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";
import { setAccessToken } from "./auth/authStorage.js";

let responseStatus;
beforeEach(() => {
  const values = new Map([["diichi_student_access_token", "existing-token"]]);
  vi.stubGlobal("localStorage", {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  });
  setAccessToken("existing-token");
  responseStatus = 200;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path) => {
      if (path.endsWith("/portal/snapshot"))
        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              profile: {
                name: "Student",
                email: "student@example.test",
                userType: "STUDENT",
              },
              classes: [],
              students: [],
              records: [],
              notifications: [],
            },
          }),
        };
      return {
        ok: responseStatus === 200,
        status: responseStatus,
        json: async () =>
          responseStatus === 200
            ? { data: { changed: true } }
            : { message: "Token hết hạn" },
      };
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function submit() {
  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <App />
    </MemoryRouter>,
  );
  fireEvent.change(await screen.findByLabelText("Mật khẩu hiện tại"), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByLabelText("Mật khẩu mới"), {
    target: { value: "NewPassword2026!" },
  });
  fireEvent.change(screen.getByLabelText("Nhập lại mật khẩu mới"), {
    target: { value: "NewPassword2026!" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Đổi mật khẩu" }));
}
describe("Student authentication navigation", () => {
  it("returns to login with confirmation after changing the password", async () => {
    await submit();
    expect(
      await screen.findByRole("heading", { name: "Đăng nhập học sinh" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Đã đổi mật khẩu thành công",
    );
    expect(localStorage.getItem("diichi_student_access_token")).toBeNull();
  });
  it("immediately returns to login when the protected endpoint rejects an expired token", async () => {
    responseStatus = 401;
    await submit();
    expect(
      await screen.findByRole("heading", { name: "Đăng nhập học sinh" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Đã đổi mật khẩu thành công/),
    ).not.toBeInTheDocument();
  });
});
