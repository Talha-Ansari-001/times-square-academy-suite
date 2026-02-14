import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './pages/LandingPage';
import PortalPage from './pages/PortalPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './hooks/useAuth';
import Spinner from './components/ui/spinner';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <Spinner className="w-12 h-12 text-primary" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" expand={true} richColors />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Spinner /></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="teachers" element={<AdminDashboard />} />
                  <Route path="students" element={<AdminDashboard />} />
                  <Route path="classes" element={<AdminDashboard />} />
                  <Route path="fees" element={<AdminDashboard />} />
                  <Route path="announcements" element={<AdminDashboard />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/*" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <DashboardLayout role="teacher">
                <Routes>
                  <Route index element={<TeacherDashboard />} />
                  <Route path="attendance" element={<TeacherDashboard />} />
                  <Route path="classes" element={<TeacherDashboard />} />
                  <Route path="fees" element={<TeacherDashboard />} />
                  <Route path="announcements" element={<TeacherDashboard />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Routes>
                  <Route index element={<StudentDashboard />} />
                  <Route path="attendance" element={<StudentDashboard />} />
                  <Route path="fees" element={<StudentDashboard />} />
                  <Route path="announcements" element={<StudentDashboard />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;