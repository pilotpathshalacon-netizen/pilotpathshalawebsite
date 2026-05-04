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
