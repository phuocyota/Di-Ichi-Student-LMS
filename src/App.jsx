import React, { useSyncExternalStore } from "react";
import LessonLibrary from './library/LessonLibrary.jsx';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./components/layout/Header.jsx";
import BottomNavigation from "./components/layout/BottomNavigation.jsx";
import HomePage from "./pages/HomePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import LessonsPage from "./pages/LessonsPage.jsx";
import ClassLessonPlanPage from "./pages/ClassLessonPlans.jsx";
import ElearningLesson from './elearning/ElearningLessons.jsx';
import HomeworkPage from "./pages/HomeworkPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import OnlinePage from "./pages/OnlinePage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import CertificatesPage from "./pages/CertificatesPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx";
import ClassroomPage from "./pages/ClassroomPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { getAccessToken, subscribeAuth } from "./auth/authStorage.js";
import { PortalProvider } from "./portal/PortalContext.jsx";

function App() {
  const location = useLocation();
  const accessToken = useSyncExternalStore(subscribeAuth, getAccessToken);

  if (location.pathname === "/login") {
    return <LoginPage />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (location.pathname.startsWith("/online/")) {
    return (
      <Routes>
        <Route path="/online/:scheduleId" element={<ClassroomPage />} />
      </Routes>
    );
  }

  return (
    <PortalProvider>
      <div className="min-h-screen pb-24 text-slate-800">
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CoursesPage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/plans/:planId" element={<ClassLessonPlanPage />} />
              <Route path="/elearning/:courseId" element={<ElearningLesson />} />
              <Route path="/lesson-library" element={<LessonLibrary />} />
              <Route path="/homework" element={<HomeworkPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
              <Route path="/quiz/:quizId/take" element={<QuizPage />} />
              <Route path="/online" element={<OnlinePage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </motion.div>
        </main>
        <BottomNavigation />
      </div>
    </PortalProvider>
  );
}

export default App;
