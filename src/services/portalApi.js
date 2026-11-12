import { getAccessToken, clearAccessToken } from "../auth/authStorage.js";
import { getApiUrl } from "./apiClient.js";
// Same authenticated portal contract used by the teacher-authored lesson renderer.
export async function portalRequest(
  path,
  { method = "GET", body, signal, download = false } = {},
) {
  const form = body instanceof FormData;
  const response = await fetch(getApiUrl() + "/portal" + path, {
    method,
    signal,
    headers: {
      Authorization: "Bearer " + getAccessToken(),
      ...(!form && body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (form ? body : JSON.stringify(body)) : undefined,
  });
  if (response.status === 401) clearAccessToken();
  if (download && response.ok)
    return {
      blob: await response.blob(),
      name: decodeURIComponent(
        response.headers.get("Content-Disposition")?.split("UTF-8''")[1] ||
          "tai-lieu",
      ),
    };
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false)
    throw new Error(
      Array.isArray(payload?.message)
        ? payload.message.join("; ")
        : payload?.message || "Không thể kết nối máy chủ",
    );
  if (payload == null) throw new Error("Máy chủ trả về dữ liệu không hợp lệ");
  return payload?.data ?? payload;
}
