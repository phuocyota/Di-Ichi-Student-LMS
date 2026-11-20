import { portalRequest } from "../services/portalApi.js";

/**
 * Thay loadPortal bằng một lần đọc fixture qua fetch("/portal/snapshot") để các test cũ giữ nguyên dữ liệu giả.
 * Ứng dụng thật gọi từng route GET (xem src/portal/portalLoaders.js).
 */
export async function fixtureLoadPortal(sections, { base, signal } = {}) {
  const data = await portalRequest("/snapshot", { signal });
  const next = { files: data.files ?? [] };
  if (base) Object.assign(next, { profile: data.profile, classes: data.classes });
  for (const section of sections) {
    next[section] = data[section] ?? [];
    if (section === "documents") next.classDocuments = data.classDocuments ?? [];
  }
  return next;
}
