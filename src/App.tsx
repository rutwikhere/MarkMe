import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import StatsRedirect from './pages/StatsRedirect';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import ProfilePage from './pages/ProfilePage';
import ClassStatsPage from './pages/ClassStatsPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Splash screen component
import iiitaLogo from './assets/iiita-logo.gif';

const SplashScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <img src={iiitaLogo} alt="IIIT Logo" className="w-40 h-40 animate-fade-in-up" />
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/:classId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AttendancePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/class-stats/:classId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ClassStatsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />



<Route
  path="/stats"
  element={
    <ProtectedRoute>
      <AppLayout>
        <StatsRedirect />
      </AppLayout>
    </ProtectedRoute>
  }
/>


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
