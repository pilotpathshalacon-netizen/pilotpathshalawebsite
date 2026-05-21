import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { TestsPage } from './pages/TestsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { OfflineLearningPage } from './pages/OfflineLearningPage';
import { ExamFocusStrategyPage } from './pages/ExamFocusStrategyPage';
import { DailyReminderPage } from './pages/DailyReminderPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-secondary_text">Loading...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-secondary_text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[30px] border border-slate-200 p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Maintenance Mode</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The website is currently under maintenance. We are working on updates and will be back shortly.
          </p>
          <div className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20">
            Please check back soon
          </div>
        </div>
      </div> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/?auth=login" replace />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/?auth=register" replace />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CoursesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <PrivateRoute>
              <LessonDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/lesson/:courseId/:lessonId"
          element={
            <PrivateRoute>
              <LessonDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-learning"
          element={
            <PrivateRoute>
              <MyLearningPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <PrivateRoute>
              <TestsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/offline-learning"
          element={
            <PrivateRoute>
              <OfflineLearningPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam-strategy"
          element={
            <PrivateRoute>
              <ExamFocusStrategyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-reminders"
          element={
            <PrivateRoute>
              <DailyReminderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/about"
          element={<AboutPage />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage />}
        />
        <Route
          path="/terms-of-use"
          element={<TermsOfUsePage />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
