# Di-Ichi Student LMS — API Contract

Phiên bản: `v1`  
Base URL: `/api/v1`  
Content-Type: `application/json`  
Xác thực: `Authorization: Bearer <access_token>`

Contract này được suy ra từ các màn hình và dữ liệu mock hiện có trong `src/datas/lmsData.js`. Thời gian trong API dùng ISO 8601 và UTC; frontend tự đổi sang múi giờ người dùng. Điểm số dùng thang `0..100`, tiến độ dùng phần trăm `0..100`.

## Quy ước chung

Response thành công:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_01J..."
  }
}
```

Response danh sách:

```json
{
  "data": [],
  "meta": {
    "requestId": "req_01J...",
    "page": 1,
    "pageSize": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

Response lỗi:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      { "field": "answers[0].answerIds", "message": "Không được để trống" }
    ]
  },
  "meta": {
    "requestId": "req_01J..."
  }
}
```

Mã lỗi chuẩn:

| HTTP | `error.code` | Ý nghĩa |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Payload/query không hợp lệ |
| 401 | `UNAUTHENTICATED` | Token thiếu, hết hạn hoặc không hợp lệ |
| 403 | `FORBIDDEN` | Không có quyền truy cập tài nguyên |
| 404 | `NOT_FOUND` | Không tìm thấy tài nguyên |
| 409 | `CONFLICT` | Trạng thái hiện tại không cho phép thao tác |
| 422 | `BUSINESS_RULE_VIOLATION` | Vi phạm quy tắc nghiệp vụ |
| 429 | `RATE_LIMITED` | Quá giới hạn request |
| 500 | `INTERNAL_ERROR` | Lỗi hệ thống |

## Endpoint tổng hợp

| Method | Path | Màn hình/chức năng |
|---|---|---|
| GET | `/me` | Header, thông tin học viên |
| GET | `/me/dashboard` | Trang chủ |
| GET | `/courses` | Danh sách khóa học |
| GET | `/courses/{courseId}` | Chi tiết khóa học |
| GET | `/courses/{courseId}/chapters` | Danh sách chương và bài học |
| GET | `/lessons/{lessonId}` | Nội dung/video bài học |
| PATCH | `/lessons/{lessonId}/progress` | Lưu tiến độ bài học |
| POST | `/lessons/{lessonId}/complete` | Hoàn thành bài học |
| GET | `/homework` | Danh sách homework |
| GET | `/homework/{homeworkId}` | Chi tiết homework |
| POST | `/homework/{homeworkId}/submissions` | Nộp bài |
| GET | `/quizzes` | Danh sách quiz |
| GET | `/quizzes/{quizId}` | Thông tin trước khi làm quiz |
| POST | `/quizzes/{quizId}/attempts` | Bắt đầu/làm lại quiz |
| GET | `/quiz-attempts/{attemptId}/questions` | Lấy câu hỏi |
| PUT | `/quiz-attempts/{attemptId}/answers/{questionId}` | Lưu câu trả lời |
| POST | `/quiz-attempts/{attemptId}/submit` | Nộp quiz |
| GET | `/online-classes` | Danh sách lớp online |
| POST | `/online-classes/{classId}/join` | Lấy link tham gia |
| GET | `/materials` | Danh sách tài liệu |
| POST | `/materials/{materialId}/access` | Lấy URL xem/tải có thời hạn |
| GET | `/me/progress` | Tổng quan và biểu đồ tiến độ |
| GET | `/me/certificates` | Danh sách chứng chỉ |
| POST | `/me/certificates/{certificateId}/access` | Lấy URL xem/tải chứng chỉ |
| GET | `/me/achievements` | XP, level, streak, huy hiệu |
| GET | `/leaderboard` | Bảng xếp hạng |

## 1. Học viên và dashboard

### `GET /me`

```json
{
  "data": {
    "id": "stu_01J...",
    "fullName": "Minh Anh",
    "avatarUrl": "https://cdn.example.com/avatars/stu_01J.jpg",
    "timezone": "Asia/Ho_Chi_Minh",
    "xp": 2480,
    "level": 12,
    "streakDays": 9,
    "nextLevel": {
      "level": 13,
      "requiredXp": 2800,
      "remainingXp": 320,
      "progressPercent": 76
    }
  },
  "meta": { "requestId": "req_01J..." }
}
```

### `GET /me/dashboard?date=2026-08-03`

`date` là ngày theo timezone của học viên. Endpoint này trả dữ liệu cần để render trang chủ trong một request.

```json
{
  "data": {
    "student": {
      "id": "stu_01J...",
      "fullName": "Minh Anh",
      "avatarUrl": "https://cdn.example.com/avatars/stu_01J.jpg",
      "xp": 2480,
      "level": 12,
      "streakDays": 9
    },
    "continueLearning": {
      "courseId": "crs_explorer_a2",
      "courseTitle": "Explorer English A2",
      "courseImageUrl": "https://cdn.example.com/courses/explorer-a2.jpg",
      "courseProgressPercent": 68,
      "lessonId": "lsn_past_simple_story",
      "lessonTitle": "Past Simple Story"
    },
    "schedule": [
      {
        "id": "evt_01J...",
        "startsAt": "2026-08-03T01:30:00Z",
        "title": "Grammar: Past Simple",
        "teacherName": "Ms. Jenny",
        "deliveryMode": "ONSITE",
        "locationLabel": "Phòng 204"
      }
    ],
    "dueHomework": [],
    "upcomingQuizzes": [],
    "featuredBadges": []
  },
  "meta": { "requestId": "req_01J..." }
}
```

## 2. Khóa học và bài học

### `GET /courses?status=IN_PROGRESS&page=1&pageSize=20`

`status`: `NOT_STARTED | IN_PROGRESS | COMPLETED`.

```json
{
  "data": [
    {
      "id": "crs_explorer_a2",
      "title": "Explorer English A2",
      "teacher": { "id": "tch_jenny", "name": "Ms. Jenny" },
      "imageUrl": "https://cdn.example.com/courses/explorer-a2.jpg",
      "status": "IN_PROGRESS",
      "statusLabel": "Đang học",
      "progressPercent": 68,
      "nextLesson": {
        "id": "lsn_past_simple_story",
        "title": "Past Simple Story"
      }
    }
  ],
  "meta": { "requestId": "req_01J...", "page": 1, "pageSize": 20, "total": 3, "totalPages": 1 }
}
```

### `GET /courses/{courseId}`

Trả cùng các field của course list, bổ sung `description`, `enrolledAt`, `completedAt` và `totalLessons`.

### `GET /courses/{courseId}/chapters`

```json
{
  "data": [
    {
      "id": "chp_adventures",
      "title": "Chapter 2: Adventures",
      "order": 2,
      "lessons": [
        {
          "id": "lsn_past_simple_story",
          "title": "Past Simple Story",
          "order": 1,
          "status": "IN_PROGRESS",
          "progressPercent": 54,
          "durationSeconds": 900
        }
      ]
    }
  ],
  "meta": { "requestId": "req_01J..." }
}
```

### `GET /lessons/{lessonId}`

```json
{
  "data": {
    "id": "lsn_past_simple_story",
    "courseId": "crs_explorer_a2",
    "chapterId": "chp_adventures",
    "title": "Past Simple Story",
    "description": "Luyện cách kể chuyện bằng thì quá khứ đơn...",
    "contentHtml": "<p>...</p>",
    "video": {
      "playbackUrl": "https://cdn.example.com/signed/video.m3u8",
      "expiresAt": "2026-08-03T04:00:00Z",
      "durationSeconds": 900
    },
    "status": "IN_PROGRESS",
    "progressPercent": 54,
    "lastPositionSeconds": 486,
    "previousLessonId": "lsn_amazing_places",
    "nextLessonId": "lsn_show_and_tell"
  },
  "meta": { "requestId": "req_01J..." }
}
```

### `PATCH /lessons/{lessonId}/progress`

```json
{
  "positionSeconds": 520,
  "progressPercent": 58
}
```

Response `200` trả `lessonId`, `status`, `positionSeconds`, `progressPercent`, `updatedAt`. Request có tính idempotent; giá trị mới không được làm giảm tiến độ đã lưu.

### `POST /lessons/{lessonId}/complete`

Không có body. Response `200`:

```json
{
  "data": {
    "lessonId": "lsn_past_simple_story",
    "status": "COMPLETED",
    "progressPercent": 100,
    "completedAt": "2026-08-03T03:20:00Z",
    "xpAwarded": 50,
    "nextLessonId": "lsn_show_and_tell"
  },
  "meta": { "requestId": "req_01J..." }
}
```

## 3. Homework

### `GET /homework?status=ASSIGNED,IN_PROGRESS,SUBMITTED&page=1&pageSize=20`

`status`: `LOCKED | ASSIGNED | IN_PROGRESS | SUBMITTED | GRADED | OVERDUE`.

```json
{
  "data": [
    {
      "id": "hw_weekend",
      "courseId": "crs_explorer_a2",
      "title": "Write about your weekend",
      "status": "ASSIGNED",
      "dueAt": "2026-08-03T13:00:00Z",
      "score": null,
      "maxScore": 10,
      "submissionId": null,
      "canSubmit": true
    }
  ],
  "meta": { "requestId": "req_01J...", "page": 1, "pageSize": 20, "total": 3, "totalPages": 1 }
}
```

### `GET /homework/{homeworkId}`

Trả các field trong list, bổ sung `instructionsHtml`, `attachments` và `submission` gần nhất.

### `POST /homework/{homeworkId}/submissions`

Content-Type có thể là `application/json` sau khi file đã upload trực tiếp lên object storage.

```json
{
  "text": "My weekend was...",
  "attachments": [
    {
      "fileName": "weekend.docx",
      "fileUrl": "https://storage.example.com/uploads/tmp_01J...",
      "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "sizeBytes": 24576
    }
  ]
}
```

Response `201` trả submission với `id`, `homeworkId`, `status: "SUBMITTED"`, `submittedAt`, `text`, `attachments`. Dùng header `Idempotency-Key` để tránh tạo hai submission khi retry.

## 4. Quiz

### `GET /quizzes?availability=AVAILABLE&page=1&pageSize=20`

```json
{
  "data": [
    {
      "id": "qz_vocabulary_sprint",
      "title": "Vocabulary Sprint",
      "questionCount": 20,
      "durationSeconds": 900,
      "availability": "AVAILABLE",
      "opensAt": null,
      "closesAt": null,
      "attemptCount": 1,
      "maxAttempts": 3,
      "latestScore": 92,
      "bestScore": 92,
      "canStart": true
    }
  ],
  "meta": { "requestId": "req_01J...", "page": 1, "pageSize": 20, "total": 3, "totalPages": 1 }
}
```

`availability`: `UPCOMING | AVAILABLE | CLOSED`.

### `GET /quizzes/{quizId}`

Trả metadata của quiz và lịch sử attempt. Không trả câu hỏi/đáp án trước khi attempt được tạo.

### `POST /quizzes/{quizId}/attempts`

Không có body. Dùng `Idempotency-Key`. Response `201`:

```json
{
  "data": {
    "id": "qat_01J...",
    "quizId": "qz_vocabulary_sprint",
    "status": "IN_PROGRESS",
    "startedAt": "2026-08-03T03:00:00Z",
    "expiresAt": "2026-08-03T03:15:00Z",
    "questionCount": 20
  },
  "meta": { "requestId": "req_01J..." }
}
```

### `GET /quiz-attempts/{attemptId}/questions`

```json
{
  "data": [
    {
      "id": "qq_01",
      "order": 1,
      "type": "SINGLE_CHOICE",
      "promptHtml": "Choose the correct answer...",
      "options": [
        { "id": "opt_a", "text": "went" },
        { "id": "opt_b", "text": "go" }
      ],
      "savedAnswerIds": []
    }
  ],
  "meta": { "requestId": "req_01J..." }
}
```

`type`: `SINGLE_CHOICE | MULTIPLE_CHOICE | TEXT`.

### `PUT /quiz-attempts/{attemptId}/answers/{questionId}`

```json
{
  "answerIds": ["opt_a"],
  "textAnswer": null
}
```

Response `200` trả `questionId`, dữ liệu đã lưu và `savedAt`. Endpoint idempotent.

### `POST /quiz-attempts/{attemptId}/submit`

Không có body. Response `200`:

```json
{
  "data": {
    "attemptId": "qat_01J...",
    "status": "SUBMITTED",
    "submittedAt": "2026-08-03T03:12:00Z",
    "score": 92,
    "correctCount": 18,
    "questionCount": 20,
    "xpAwarded": 100,
    "earnedBadges": [
      { "id": "bdg_quiz_master", "name": "Quiz Master" }
    ]
  },
  "meta": { "requestId": "req_01J..." }
}
```

## 5. Lớp online

### `GET /online-classes?from=2026-08-03T00:00:00Z&to=2026-08-10T00:00:00Z`

```json
{
  "data": [
    {
      "id": "cls_speaking_junior",
      "courseId": "crs_speaking_junior",
      "className": "Speaking Club Junior",
      "teacher": { "id": "tch_daniel", "name": "Mr. Daniel" },
      "startsAt": "2026-08-03T07:00:00Z",
      "endsAt": "2026-08-03T08:00:00Z",
      "platform": "ZOOM",
      "roomLabel": "Zoom Room A",
      "status": "UPCOMING",
      "canJoin": false
    }
  ],
  "meta": { "requestId": "req_01J..." }
}
```

`platform`: `ZOOM | GOOGLE_MEET | TEAMS | OTHER`; `status`: `UPCOMING | LIVE | ENDED | CANCELLED`.

### `POST /online-classes/{classId}/join`

Response `200` khi học viên được phép vào lớp:

```json
{
  "data": {
    "joinUrl": "https://zoom.us/j/...?token=...",
    "expiresAt": "2026-08-03T08:00:00Z"
  },
  "meta": { "requestId": "req_01J..." }
}
```

Trả `409 CLASS_NOT_OPEN` nếu chưa đến giờ hoặc lớp đã kết thúc. Không đưa meeting URL thật vào endpoint danh sách.

## 6. Tài liệu

### `GET /materials?courseId={courseId}&type=PDF&page=1&pageSize=20`

`type`: `PDF | VIDEO | AUDIO | SLIDE | WORD | OTHER`.

```json
{
  "data": [
    {
      "id": "mat_unit_6_vocabulary",
      "courseId": "crs_explorer_a2",
      "type": "PDF",
      "title": "Unit 6 Vocabulary",
      "mimeType": "application/pdf",
      "sizeBytes": 524288,
      "canDownload": true
    }
  ],
  "meta": { "requestId": "req_01J...", "page": 1, "pageSize": 20, "total": 6, "totalPages": 1 }
}
```

### `POST /materials/{materialId}/access`

```json
{ "disposition": "INLINE" }
```

`disposition`: `INLINE | ATTACHMENT`. Response trả `url`, `expiresAt`, `fileName`, `mimeType`.

## 7. Tiến độ, thành tích và xếp hạng

### `GET /me/progress?courseId={courseId}&period=WEEK&from=2026-06-22&to=2026-08-03`

```json
{
  "data": {
    "summary": {
      "completionPercent": 78,
      "averageScore": 87,
      "homeworkCompleted": 12,
      "homeworkTotal": 15,
      "quizzesCompleted": 9,
      "quizzesTotal": 10
    },
    "series": [
      {
        "periodStart": "2026-06-22",
        "label": "T1",
        "score": 62,
        "xpEarned": 420
      }
    ]
  },
  "meta": { "requestId": "req_01J..." }
}
```

`period`: `DAY | WEEK | MONTH`.

### `GET /me/achievements`

```json
{
  "data": {
    "xp": 2480,
    "level": 12,
    "streak": {
      "currentDays": 9,
      "nextMilestoneDays": 10
    },
    "badges": [
      {
        "id": "bdg_quiz_master",
        "name": "Quiz Master",
        "description": "Hoàn thành mốc quiz",
        "iconUrl": "https://cdn.example.com/badges/quiz-master.svg",
        "earnedAt": "2026-07-15T09:00:00Z"
      }
    ]
  },
  "meta": { "requestId": "req_01J..." }
}
```

### `GET /leaderboard?period=WEEK&limit=10`

```json
{
  "data": {
    "period": "WEEK",
    "startsAt": "2026-08-03T00:00:00Z",
    "endsAt": "2026-08-10T00:00:00Z",
    "entries": [
      {
        "rank": 1,
        "studentId": "stu_01J...",
        "studentName": "Minh Anh",
        "avatarUrl": "https://cdn.example.com/avatars/stu_01J.jpg",
        "xp": 2480,
        "isCurrentStudent": true
      }
    ],
    "currentStudent": {
      "rank": 1,
      "studentId": "stu_01J...",
      "studentName": "Minh Anh",
      "xp": 2480,
      "isCurrentStudent": true
    }
  },
  "meta": { "requestId": "req_01J..." }
}
```

## 8. Chứng chỉ

### `GET /me/certificates?page=1&pageSize=20`

```json
{
  "data": [
    {
      "id": "cert_a2_explorer",
      "title": "A2 Explorer Certificate",
      "issuedAt": "2026-07-12T00:00:00Z",
      "resultLabel": "Excellent",
      "thumbnailUrl": "https://cdn.example.com/certificates/cert_a2_explorer.png"
    }
  ],
  "meta": { "requestId": "req_01J...", "page": 1, "pageSize": 20, "total": 2, "totalPages": 1 }
}
```

### `POST /me/certificates/{certificateId}/access`

Request giống material access. Response trả signed `url`, `expiresAt`, `fileName`, `mimeType: "application/pdf"`.

## Quy tắc nghiệp vụ quan trọng

- Mọi tài nguyên `/me/*` được xác định từ access token; client không truyền `studentId`.
- Học viên chỉ xem được course, lesson, homework, quiz, material và online class thuộc enrollment của mình.
- Signed URL của video, tài liệu, lớp học và chứng chỉ phải có hạn ngắn và không được lưu cache công khai.
- Server là nguồn thời gian chuẩn cho quiz. Khi `expiresAt` đã qua, attempt không nhận thêm answer và được tự động submit.
- `POST` tạo submission/attempt dùng `Idempotency-Key`; retry cùng key phải trả cùng kết quả.
- Điểm, XP, level, streak, badge và trạng thái hoàn thành chỉ do server tính; client không được gửi các giá trị này để cập nhật.
- Các endpoint danh sách mặc định `page=1`, `pageSize=20`; `pageSize` tối đa `100`.
- Date-only dùng `YYYY-MM-DD`; timestamp dùng ISO 8601 UTC, ví dụ `2026-08-03T07:00:00Z`.

## Ánh xạ dữ liệu mock sang DTO

| Mock hiện tại | DTO API |
|---|---|
| `student.name` | `student.fullName` |
| `student.avatar` | `student.avatarUrl` |
| `student.streak` | `student.streakDays` / `streak.currentDays` |
| `courses[].progress` | `courses[].progressPercent` |
| `courses[].tag` | `courses[].statusLabel` |
| `courses[].nextLesson` | `courses[].nextLesson.title` |
| `timeline[].time` | `schedule[].startsAt` |
| `timeline[].type` | `schedule[].deliveryMode` + `locationLabel` |
| `homework[].due` | `homework[].dueAt` |
| `quizzes[].duration` | `quizzes[].durationSeconds` |
| `quizzes[].start` | `quizzes[].availability`, `opensAt`, `canStart` |
| `onlineClasses[].time` | `onlineClasses[].startsAt`, `endsAt` |
| `materials[].type` | `materials[].type` enum |
| `certificates[].date` | `certificates[].issuedAt` |
| `certificates[].score` | `certificates[].resultLabel` |
| `progressData[].week` | `progress.series[].label` |

