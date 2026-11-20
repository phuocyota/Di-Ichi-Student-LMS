import {
  useUpdatesConnection,
  useResourceUpdates,
  PORTAL_RESOURCES,
} from "../services/realtime.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./portal.css";

import { PortalContext as Context } from "./portalStore.js";
import { portalRequest } from "../services/portalApi.js";
import {
  PORTAL_SECTIONS,
  loadPortal,
  mergePortal,
  sectionsForChange,
} from "./portalLoaders.js";
import { clearAccessToken as clearAuthSession } from "../auth/authStorage.js";
export function PortalProvider({ children }) {
  const realtimeStatus = useUpdatesConnection();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const lock = useRef(false);
  const revision = useRef(0);
  const sectionRevision = useRef(new Map());
  const baseRevision = useRef(0);
  const dataRef = useRef(null);
  dataRef.current = data;
  // Mỗi phần gọi route GET riêng; chỉ tải lại phần bị ảnh hưởng bởi thay đổi.
  const load = useCallback(async (sections, { base = false, signal } = {}) => {
    const request = ++revision.current;
    sections.forEach((section) => sectionRevision.current.set(section, request));
    const withBase = base || !dataRef.current;
    try {
      const next = await loadPortal(sections, { base: withBase, signal });
      // Bỏ phần đã có yêu cầu mới hơn đang chạy để phản hồi cũ không đè dữ liệu mới.
      for (const section of sections)
        if (sectionRevision.current.get(section) !== request) {
          delete next[section];
          if (section === "documents") delete next.classDocuments;
        }
      if (withBase) {
        if (request > baseRevision.current) baseRevision.current = request;
        else {
          delete next.profile;
          delete next.classes;
        }
      }
      setData((current) => mergePortal(current, next));
      setError("");
    } catch (e) {
      if (!signal?.aborted) setError(e.message);
      throw e;
    }
  }, []);
  const reload = useCallback(
    (signal) => load(PORTAL_SECTIONS, { base: true, signal }),
    [load],
  );
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal).catch(() => {});
    return () => controller.abort();
  }, [reload]);
  useResourceUpdates(
    (change) => {
      const { sections, base } = sectionsForChange(change);
      return sections.length || base
        ? load(sections, { base }).catch(() => {})
        : undefined;
    },
    PORTAL_RESOURCES,
    !busy,
  );
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
