# Di-Ichi Student LMS — Tổng Quan Mã Nguồn (Source Overview)

Dài tài liệu: **v1.0**  
Dự án: **Di-Ichi Student LMS**  
Thư mục gốc: `Di-Ichi-Student-LMS/`

---

## 1. Giới thiệu Tổng Quan

**Di-Ichi Student LMS** là ứng dụng web dành cho học viên thuộc hệ thống quản lý học tập (LMS) Di-Ichi. Ứng dụng được xây dựng theo mô hình **Single Page Application (SPA)** hiện đại, giao diện trực quan, tương thích nhiều thiết bị (Mobile & Desktop), phục vụ đầy đủ các tính năng cho học viên:

- Theo dõi tiến độ học tập, điểm thưởng (XP), cấp độ (Level) và chuỗi ngày học tập (Streak).
- Xem danh sách khóa học, từng chương học và xem bài giảng / video.
- Quản lý và nộp bài tập về nhà (Homework).
- Thực hiện bài kiểm tra trắc nghiệm (Quiz) có bấm giờ và xem kết quả / lịch sử làm bài.
- Tra cứu thư viện tài liệu (Materials: PDF, Video, Audio, Slide...).
- Theo dõi lịch học lớp trực tuyến (Online Classes via Zoom/Meet).
- Theo dõi báo cáo tiến độ bằng biểu đồ, bảng xếp hạng (Leaderboard) và bộ sưu tập chứng chỉ (Certificates), huy hiệu (Badges).

---

## 2. Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Tác dụng |
|---|---|---|
| **Core Framework** | React 18+ (JavaScript / ESM) | Xây dựng giao diện thành phần (Component-based UI) |
| **Build Tool & Dev Server** | Vite (latest) | Biên dịch siêu nhanh, Hot Module Replacement (HMR) |
| **Routing** | React Router DOM v6 | Điều hướng SPA đa trang mượt mà không reload |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first CSS cho giao diện hiện đại, responsive |
| **Animations** | Framer Motion | Hiệu ứng chuyển trang và hiệu ứng động micro-interactions |
| **Icons** | Lucide React | Bộ biểu tượng SVG nhất quán |
| **Charts** | Recharts | Vẽ biểu đồ tiến độ học tập dạng đường/cột |

---

## 3. Cấu Trúc Thư Mục & Tệp Tin (Directory & File Structure)

```
Di-Ichi-Student-LMS/
├── API_contract_student.md     # Specification API RESTful v1 cho việc tích hợp Backend
├── SOURCE_OVERVIEW.md          # Tài liệu tổng quan mã nguồn dự án (file này)
├── index.html                  # File HTML đầu vào, mount điểm root của React
├── package.json                # Khai báo dependency, devDependency & npm scripts
├── vite.config.js              # Cấu hình Vite & plugin Tailwind CSS
├── src/
│   ├── main.jsx                # Entry point của ứng dụng React (Khởi tạo BrowserRouter)
│   ├── App.jsx                 # Layout chính, các tuyến đường Routing & Animation wrapper
│   ├── styles.css              # Custom CSS & Tailwind directives
│   ├── assets/                 # Chứa tài nguyên hình ảnh tĩnh, logo, icon
│   ├── components/             # Chứa toàn bộ các UI Component
│   │   ├── common/             # Component nguyên tử dùng chung (Card, ProgressBar, MiniMetric, ...)
│   │   ├── layout/             # Layout chung (Header, BottomNavigation, NotificationDropdown)
│   │   ├── icons/              # Biểu tượng UI tùy chỉnh
│   │   ├── HomePage/           # Thành phần giao diện Trang chủ
│   │   ├── CoursesPage/        # Thành phần giao diện Khóa học
│   │   ├── LessonsPage/        # Thành phần giao diện Bài học & Video Player
│   │   ├── HomeworkPage/       # Thành phần Bài tập về nhà & Form nộp bài
│   │   ├── QuizPage/           # Thành phần bài kiểm tra Quiz & màn hình làm bài thi
│   │   ├── MaterialsPage/      # Thành phần quản lý & preview tài liệu
│   │   ├── OnlinePage/         # Giao diện lớp học Online
│   │   ├── ProgressPage/       # Giao diện báo cáo tiến độ & biểu đồ
│   │   ├── AchievementsPage/   # Bảng xếp hạng (Leaderboard) & Huy hiệu (Badges)
│   │   └── CertificatesPage/   # Giao diện hiển thị & xem trước chứng chỉ
│   ├── datas/                  # Tập hợp các file Mock Data phục vụ Frontend
│   │   ├── lmsData.js          # File tổng hợp dữ liệu học viên, menu, lịch học & re-export các data khác
│   │   ├── homeData.js         # Dữ liệu banner, lịch học trong ngày & homework sắp đến hạn
│   │   ├── courseData.js       # Danh sách khóa học, chương học
│   │   ├── lessonData.js       # Nội dung chi tiết từng bài học, link video
│   │   ├── homeworkData.js     # Danh sách bài tập về nhà theo từng trạng thái
│   │   ├── quizData.js         # Dữ liệu các bài Quiz & ngân hàng câu hỏi trắc nghiệm
│   │   ├── materialsData.js    # Danh sách tài liệu theo định dạng (PDF, Slide, Audio...)
│   │   ├── progressData.js     # Dữ liệu vẽ biểu đồ tiến độ học tập
│   │   ├── achievementData.js  # Thông tin XP, Level, Streak, Badges & Leaderboard
│   │   ├── certificateData.js  # Danh sách chứng chỉ đạt được
│   │   └── notificationData.js # Danh sách thông báo hệ thống cho học viên
│   └── utils/
│       └── quizAttempts.js     # Utility quản lý lưu lịch sử làm Quiz vào LocalStorage
```

---

## 4. Kiến Trúc Luồng Dữ Liệu & Điều Hướng (Data Flow & Routing)

### 4.1 Routing (`src/App.jsx`)
Ứng dụng sử dụng `react-router-dom` kết hợp với `framer-motion` để tạo hiệu ứng chuyển trang:

| Đường dẫn (Route) | Trang (Page Component) | Mô tả chức năng |
|---|---|---|
| `/` | `HomePage` | Dashboard chính: Xem XP, Level, Lịch học hôm nay, Bài sắp hết hạn |
| `/courses`, `/courses/:courseId` | `CoursesPage` | Danh sách các khóa học & Xem chi tiết khóa học |
| `/lessons` | `LessonsPage` | Giao diện xem bài giảng, danh sách chương & trình phát video |
| `/homework` | `HomeworkPage` | Quản lý danh sách bài tập, xem chi tiết & nộp bài |
| `/quiz`, `/quiz/:quizId`, `/quiz/:quizId/take` | `QuizPage` | Danh sách Quiz, thông tin Quiz & Màn hình đang làm bài (Quiz Taking) |
| `/online` | `OnlinePage` | Danh sách các lớp học trực tuyến qua Zoom/Meet |
| `/materials` | `MaterialsPage` | Thư viện tài liệu học tập & Xem trước file |
| `/progress` | `ProgressPage` | Đồ thị báo cáo tiến độ học tập hàng tuần |
| `/certificates` | `CertificatesPage` | Danh sách và xem trước chứng chỉ hoàn thành |
| `/achievements` | `AchievementsPage` | Bảng xếp hạng học viên, danh sách huy hiệu |

### 4.2 Dữ liệu Mock & Quản lý State
- Hiện tại toàn bộ ứng dụng chạy dựa trên dữ liệu Mock tại thư mục `src/datas/`.
- Quản lý trạng thái tức thời (Local State) trong từng React Component bằng `useState` và `useEffect`.
- Kết quả làm bài Quiz (`quizAttempts.js`) được tự động lưu vết và duy trì thông qua `localStorage` trình duyệt.

---

## 5. Chi Tiết Các Module Chức Năng Chính

### 5.1 Trang Chủ (`HomePage`)
- **[HeroBanner](file:///c:/Users/Admin/code/work/Di-Ichi-Student-LMS/src/components/HomePage/HeroBanner.jsx)**: Hiển thị khóa học đang học dở và phím nhanh tiếp tục bài học.
- **[TodayAndAchievements](file:///c:/Users/Admin/code/work/Di-Ichi-Student-LMS/src/components/HomePage/TodayAndAchievements.jsx)**: Lịch học trong ngày & tiến trình lên cấp.
- **[DueCard](file:///c:/Users/Admin/code/work/Di-Ichi-Student-LMS/src/components/HomePage/DueCard.jsx)**: Cảnh báo các bài tập về nhà sắp đến hạn nộp.
- **[MenuGrid](file:///c:/Users/Admin/code/work/Di-Ichi-Student-LMS/src/components/HomePage/MenuGrid.jsx)**: Bộ lối tắt truy cập nhanh vào các tính năng.

### 5.2 Khóa Học & Bài Học (`CoursesPage` & `LessonsPage`)
- Danh sách khóa học phân loại theo trạng thái (Đang học, Hoàn thành).
- Trình xem danh sách chương (`ChapterList`) và chọn bài học (`LessonItem`).
- Player phát video bài học (`LessonPlayer`) tích hợp thanh tiến độ và điều hướng tới bài tiếp theo / bài trước đó.

### 5.3 Bài Tập Về Nhà (`HomeworkPage`)
- Phân loại bài tập theo các tab: *Chưa nộp (Assigned)*, *Đang làm (In Progress)*, *Đã nộp (Submitted)*, *Đã chấm (Graded)*, *Quá hạn (Overdue)*.
- Hỗ trợ xem yêu cầu bài tập, tải tệp đính kèm và form gửi bài nộp với tùy chọn tải file/nhập nội dung văn bản.

### 5.4 Bài Kiểm Tra Quiz (`QuizPage`)
- Hiển thị danh sách các bài Quiz theo mức độ khả dụng (*Sẵn sàng*, *Sắp mở*, *Đã đóng*).
- Giao diện làm bài trực tiếp (`QuizTaking`):
  - Đồng hồ đếm ngược thời gian làm bài tự động.
  - Hỗ trợ câu hỏi Trắc nghiệm 1 lựa chọn (Single Choice) hoặc Nhiều lựa chọn (Multiple Choice).
  - Tự động chấm điểm, tính XP thưởng và ghi nhận vào `localStorage`.

### 5.5 Thư Viện Tài Liệu (`MaterialsPage`)
- Hỗ trợ nhiều định dạng file: PDF, Video, Audio, Slide, Word.
- Lọc tài liệu theo môn học / khóa học và loại định dạng.
- Chế độ xem trước tài liệu trực tiếp (`MaterialPreview`).

### 5.6 Tiến Độ & Thành Tích (`ProgressPage`, `AchievementsPage`, `CertificatesPage`)
- Biểu đồ Recharts minh họa chỉ số tiến bộ học tập qua các tuần.
- Bảng xếp hạng (Leaderboard) học viên xuất sắc nhất tuần/tháng.
- Bộ sưu tập huy hiệu (Badges) nhận được khi hoàn thành các cột mốc.
- Xem trước chứng chỉ điện tử (`CertificatesPage`).

---

## 6. Sẵn Sàng Tích Hợp Backend (API Contract Integration)

Tệp **[API_contract_student.md](file:///c:/Users/Admin/code/work/Di-Ichi-Student-LMS/API_contract_student.md)** chứa thiết kế API RESTful v1 hoàn chỉnh:
- **Base URL**: `/api/v1`
- **Xác thực**: `Authorization: Bearer <access_token>`
- **Chuẩn hóa Response**: Cấu trúc JSON nhất quán (`data`, `meta`, `error`).
- **Danh sách Endpoint**: Đáp ứng trọn vẹn mọi thao tác từ lấy thông tin cá nhân `/me`, khóa học `/courses`, bài tập `/homework`, quiz `/quizzes`, tài liệu `/materials` đến xếp hạng `/leaderboard`.
- **Bảng Ánh Xạ**: File hợp đồng có sẵn bảng quy đổi dữ liệu từ mock sang DTO chuẩn.

---

## 7. Hướng Dẫn Vận Hành & Lệnh (Commands)

### Cài đặt phụ thuộc:
```bash
npm install
```

### Chạy ứng dụng trong môi trường Dev:
```bash
npm run dev
```
*(Mặc định lắng nghe tại `http://localhost:5173` hoặc `--host 0.0.0.0`)*

### Đóng gói ứng dụng cho Production:
```bash
npm run build
```

### Xem trước bản Build Production:
```bash
npm run preview
```

---
*Tài liệu Tổng quan Mã nguồn được tự động tạo và cập nhật cho dự án Di-Ichi Student LMS.*
