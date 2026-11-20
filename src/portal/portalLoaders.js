import { apiRequest } from "../services/apiClient.js";
import { portalRequest } from "../services/portalApi.js";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

/** Đọc hết các trang của route GET CRUD; backend tự lọc theo lớp và dữ liệu của chính học viên. */
export async function listAll(path, params = {}, signal) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const query = new URLSearchParams({
      ...params,
      page: String(page),
      size: String(PAGE_SIZE),
    });
    const result = await apiRequest(`${path}?${query}`, { signal });
    const data = Array.isArray(result?.data) ? result.data : [];
    rows.push(...data);
    if (!data.length || rows.length >= Number(result?.total ?? 0)) return rows;
  }
  throw new Error(`Dữ liệu ${path} quá lớn, vui lòng thử lại sau.`);
}

const byTime = (key, direction = 1) => (a, b) =>
  direction * (Date.parse(a[key] ?? 0) - Date.parse(b[key] ?? 0));

// Mỗi phần dữ liệu cổng học viên gọi đúng route GET của nó.
export const SECTION_LOADERS = {
  courses: async (signal) => ({ courses: await listAll("/course", {}, signal) }),
  students: async (signal) => ({
    students: await listAll("/student", {}, signal),
  }),
  enrollments: async (signal) => ({
    enrollments: await listAll("/enrollment", { isCurrent: "true" }, signal),
  }),
  schedules: async (signal) => ({
    schedules: (await listAll("/schedule", {}, signal))
      .map((s) => ({
        id: s.id,
        classId: s.classId,
        startAt: s.startAt,
        endAt: s.endAt,
        status: s.status,
        lessonNote: s.lessonNote,
        room: s.room,
        teacher: s.teacher,
      }))
      .sort(byTime("startAt")),
  }),
  homework: async (signal) => ({
    homework: (await listAll("/homework", {}, signal)).sort(
      byTime("deadline", -1),
    ),
  }),
  submissions: async (signal) => ({
    submissions: await listAll("/homework-submission", {}, signal),
  }),
  scores: async (signal) => ({ scores: await listAll("/score", {}, signal) }),
  certificates: async (signal) => {
    const certificates = await listAll("/student-certificate", {}, signal);
    return {
      certificates,
      files: certificates
        .filter((c) => c.fileId)
        .map((c) => ({ id: c.fileId, fileName: c.fileName })),
    };
  },
  notifications: async (signal) => ({
    notifications: (await listAll("/notification", {}, signal))
      .sort(byTime("createdAt", -1))
      .slice(0, 100),
  }),
  // Bài giảng, quiz, học liệu, lượt làm bài, điểm danh không có route CRUD: dùng route portal.
  records: async (signal) => {
    const { records, files } = await portalRequest("/records", { signal });
    return { records, files };
  },
  documents: async (signal) => {
    const [documents, classDocuments] = await Promise.all([
      listAll("/document", {}, signal),
      listAll("/class-document", {}, signal),
    ]);
    return {
      documents,
      classDocuments,
      files: documents
        .filter((d) => d.fileId)
        .map((d) => ({ id: d.fileId, fileName: d.fileName })),
    };
  },
};
export const PORTAL_SECTIONS = Object.keys(SECTION_LOADERS);

/** Phần nền: hồ sơ (route portal) và lớp đang học (GET /class). */
export async function loadBase(signal) {
  const [profile, classes] = await Promise.all([
    portalRequest("/profile", { signal }),
    listAll("/class", {}, signal),
  ]);
  return { profile, classes };
}

// Tài nguyên thay đổi (từ /updates) -> phần cần tải lại. Không có trong bảng: tải lại toàn bộ.
const RESOURCE_SECTIONS = {
  schedule: ["schedules", "records"],
  room: ["schedules"],
  "class-room": ["schedules"],
  "class-weekly-schedule": ["schedules"],
  "attendance-record": ["records"],
  homework: ["homework", "submissions"],
  "homework-submission": ["submissions"],
  score: ["scores"],
  notification: ["notifications"],
  document: ["documents"],
  "class-document": ["documents"],
  "student-certificate": ["certificates"],
  enrollment: ["enrollments"],
  portal: ["records", "homework", "submissions", "scores", "notifications"],
  workspace: ["schedules", "records", "notifications"],
  "lesson-library": [],
  "finance-transaction": [],
  payment: [],
  "debt-schedule": [],
};

/** Phần bị ảnh hưởng bởi thay đổi; `base` = cần tải lại hồ sơ và danh sách lớp. */
export function sectionsForChange(change) {
  const resources = change?.resources ?? [];
  if (!change || change.resync || resources.includes("*"))
    return { sections: PORTAL_SECTIONS, base: true };
  const affected = new Set();
  for (const resource of resources) {
    const mapped = RESOURCE_SECTIONS[resource];
    if (!mapped) return { sections: PORTAL_SECTIONS, base: true };
    mapped.forEach((section) => affected.add(section));
  }
  return { sections: [...affected], base: false };
}

/** Tải các phần được yêu cầu (và phần nền nếu cần), trả về khóa để gộp vào dữ liệu hiện có. */
export async function loadPortal(sections, { base, signal }) {
  const [baseData, ...parts] = await Promise.all([
    base ? loadBase(signal) : null,
    ...sections.map((section) => SECTION_LOADERS[section](signal)),
  ]);
  const next = { ...(baseData ?? {}), files: [] };
  for (const part of parts)
    for (const [key, value] of Object.entries(part))
      if (key === "files") next.files.push(...value);
      else next[key] = value;
  return next;
}

/** Gộp phản hồi một phần; files hợp nhất theo id vì đến từ nhiều route. */
export function mergePortal(current, next) {
  const files = new Map((current?.files ?? []).map((file) => [file.id, file]));
  for (const file of next.files ?? [])
    files.set(file.id, { ...files.get(file.id), ...file });
  return { ...current, ...next, files: [...files.values()] };
}
