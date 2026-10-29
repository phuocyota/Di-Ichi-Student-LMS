# Student LMS - API ?ang s? d?ng

Frontend d?ng VITE_API_URL l?m origin backend v? g?i /portal/*; kh?ng c? prefix /api/v1.

X?c th?c: POST /auth/student/login; c?c API portal g?i Authorization: Bearer token.
Response JSON: {success, message, data}.

D? li?u m?n h?nh t?i t? GET /portal/snapshot: profile, classes, courses, schedules, homework, submissions, scores, certificates, documents, classDocuments, notifications, records, files.

- N?p b?i: POST /portal/homework/:id/submissions v?i {fileIds, note}.
- Upload bytes: POST /portal/files, multipart field file, t?i ?a 50 MB/t?p.
- T?i t?p: GET /portal/files/:id c? JWT v? ki?m tra quy?n.
- Quiz/exam: POST /portal/quizzes/:id/attempts, PATCH /portal/attempts/:id/answers, POST /portal/attempts/:id/submit v?i {answers}.
- Ti?n ??: PATCH /portal/lessons/:id/progress v?i {percent}.
- Th?o lu?n: POST/PATCH/DELETE /portal/records[/id]; Student ch? s?a th?o lu?n c?a m?nh.
- ??c th?ng b?o: PATCH /portal/notifications/:id/read.

Backend ch?m ?i?m quiz v? l?u ??p ?n; frontend kh?ng nh?n answer c?a ??. Student ch? th?y ?i?m homework sau khi Teacher tr? b?i.
M?n ch?a c? d? li?u hi?n th? tr?ng, l?i API c? Th? l?i; kh?ng fallback sang d? li?u m?u.
Th?nh t?ch l?y t? b?i h?c/l??t quiz th?c t?; kh?ng c?n XP/streak gi?.
LiveKit d?ng API ri?ng nh? hi?n t?i, kh?ng thay ??i trong ??t n?i API n?y.

C?n tri?n khai backend c? module portal v? migration 1793318400000-AddPortalRecord tr??c frontend.
Chi ti?t contract v? tri?n khai n?m t?i PORTAL_API.md trong repo di-ichi-crm-services.

Ki?m tra: npm test -- --configLoader runner; npm run build.
# Đổi mật khẩu học sinh

- Header → Đổi mật khẩu → `/profile`.
- `POST /auth/student/change-password`, Bearer token, body `{currentPassword, newPassword}`.
- Mật khẩu mới tối thiểu 8 ký tự, tối đa 72 byte; cần nhập xác nhận trên giao diện.
- Học viên mới đăng nhập bằng email và mật khẩu ban đầu `123456`.

