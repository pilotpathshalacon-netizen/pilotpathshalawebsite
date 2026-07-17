import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
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
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const WEBSITE_CONSTRUCTION_MODE = false;

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

const BrowserPrivacyShield = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const updateShield = () => {
      const windowFocused = typeof document.hasFocus === 'function' ? document.hasFocus() : true;
      setIsVisible(document.visibilityState !== 'visible' || !windowFocused);
    };

    updateShield();
    document.addEventListener('visibilitychange', updateShield);
    window.addEventListener('blur', updateShield);
    window.addEventListener('focus', updateShield);

    return () => {
      document.removeEventListener('visibilitychange', updateShield);
      window.removeEventListener('blur', updateShield);
      window.removeEventListener('focus', updateShield);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f1115] p-6 text-center text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#e9b400]">Privacy Shield</p>
        <h2 className="mt-4 text-3xl font-bold">Protected content hidden</h2>
        <p className="mt-3 text-sm leading-7 text-white/75">
          This window is inactive, so the website view is temporarily covered to reduce background visibility.
        </p>
      </div>
    </div>
  );
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
      <BrowserPrivacyShield />
      <div>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
      </div>
    </Router>
  );
}

export default App;
