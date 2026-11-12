import {
  useUpdatesConnection,
  useResourceUpdates,
  PORTAL_RESOURCES,
} from "../services/realtime.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./portal.css";

import { PortalContext as Context } from "./portalStore.js";
import { portalRequest } from "../services/portalApi.js";
import { clearAccessToken as clearAuthSession } from "../auth/authStorage.js";
export function PortalProvider({ children }) {
  const realtimeStatus = useUpdatesConnection();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const lock = useRef(false);
  const revision = useRef(0);
  const reload = useCallback(async (signal) => {
    const request = ++revision.current;
    try {
      const next = await portalRequest("/snapshot", { signal });
      if (request === revision.current) {
        setData(next);
        setError("");
      }
    } catch (e) {
      if (request === revision.current && !signal?.aborted) setError(e.message);
      throw e;
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal).catch(() => {});
    return () => controller.abort();
  }, [reload]);
  useResourceUpdates(() => reload().catch(() => {}), PORTAL_RESOURCES, !busy);
  // One lock owns the whole workflow, including file uploads before the final write.
  const mutate = async (work) => {
    if (lock.current) {
      setError("Đang xử lý thao tác trước. Vui lòng chờ hoàn tất rồi thử lại.");
      return null;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await work();
      try {
        await reload();
        setNotice("Đã lưu thành công");
      } catch (e) {
        setError(`Đã lưu, nhưng chưa tải lại được dữ liệu: ${e.message}`);
      }
      return result;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!busy) return;
    const preventUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventUnload);
    return () => window.removeEventListener("beforeunload", preventUnload);
  }, [busy]);
  const preventBusyNavigation = (event) => {
    if (lock.current && event.target.closest("a")) {
      event.preventDefault();
      event.stopPropagation();
      setError(
        "Đang xử lý bài nộp. Vui lòng chờ hoàn tất trước khi chuyển trang.",
      );
    }
  };
  const act = (path, options = {}) =>
    mutate(() => portalRequest(path, options));
  const download = async (id) => {
    try {
      const { blob, name } = await portalRequest(`/files/${id}`, {
        download: true,
      });
      const url = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <Context.Provider
      value={{
        data,
        act,
        mutate,
        busy,
        download,
        reload,
        setError,
        realtimeStatus,
      }}
    >
      <div className="portal-status" aria-live="polite">
        <p className={`portal-realtime is-${realtimeStatus}`}>
          {realtimeStatus === "live"
            ? "Đang đồng bộ trực tiếp"
            : realtimeStatus === "connecting"
              ? "Đang kết nối đồng bộ…"
              : "Đang kết nối lại · Tạm cập nhật mỗi 30 giây"}
        </p>
        {busy && (
          <p role="status">
            Đang xử lý bài nộp hoặc thao tác khác. Vui lòng chờ hoàn tất.
          </p>
        )}
        {error && (
          <div role="alert" className="portal-error">
            {error}{" "}
            <button disabled={busy} onClick={() => reload().catch(() => {})}>
              Thử lại
            </button>
            <button
              disabled={busy}
              onClick={() => {
                clearAuthSession();
                window.location.assign("/login");
              }}
            >
              Đăng xuất
            </button>
          </div>
        )}
        {notice && <div className="portal-notice">{notice}</div>}
      </div>
      {data ? (
        <div onClickCapture={preventBusyNavigation}>{children}</div>
      ) : (
        !error && (
          <p className="portal-loading" role="status">
            Đang tải dữ liệu…
          </p>
        )
      )}
    </Context.Provider>
  );
}
