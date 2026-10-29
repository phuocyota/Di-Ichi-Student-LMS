import React, { useState } from "react";
import { apiRequest } from "../services/apiClient.js";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (Array.from(newPassword).length < 8) {
      setError("Mật khẩu mới cần ít nhất 8 ký tự");
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setError("Mật khẩu mới quá dài, vui lòng chọn mật khẩu ngắn hơn");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }
    setBusy(true);
    try {
      await apiRequest("/auth/student/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
        keepSessionOn401: true,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="portal-card">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={submit}>
        <label>
          Mật khẩu hiện tại
          <input
            required
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            disabled={busy}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          Mật khẩu mới
          <input
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            value={newPassword}
            disabled={busy}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Nhập lại mật khẩu mới
          <input
            required
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            disabled={busy}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="portal-error">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="portal-notice">
            Đã đổi mật khẩu thành công.
          </p>
        )}
        <button className="primary" disabled={busy}>
          {busy ? "Đang lưu…" : "Đổi mật khẩu"}
        </button>
      </form>
    </section>
  );
}
