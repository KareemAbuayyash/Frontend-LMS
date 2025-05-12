// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Auth
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import Layout from './components/Layout/Layout';
import InstructorLayout from './components/Layout/InstructorLayout';

// Admin pages
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Courses from './pages/AdminDashboard/Courses';
import AdminUsers from './pages/AdminDashboard/Users';
import Enrollments from './pages/AdminDashboard/Enrollments';

// Instructor pages
import InstructorDashboard from './pages/InstructorDashboard/InstructorDashboard';
import InstructorCourses   from './pages/InstructorDashboard/Courses';
import Assignments         from './pages/InstructorDashboard/Assignments';
import Submissions         from './pages/InstructorDashboard/Submissions';
import Profile             from './pages/InstructorDashboard/Profile';

// Error boundary
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin section */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Layout showSidebar>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses"     element={<Courses />} />
        <Route
          path="users"
          element={
            <ErrorBoundary>
              <AdminUsers />
            </ErrorBoundary>
          }
        />
        <Route
          path="enrollments"
          element={
            <ErrorBoundary>
              <Enrollments />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* Instructor section */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <InstructorLayout>
              <Outlet />
            </InstructorLayout>
          </ProtectedRoute>
        }
      >
        <Route index         element={<InstructorDashboard />} />
        <Route path="courses"     element={<InstructorCourses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="profile"     element={<Profile />} />
        <Route path="*" element={<Navigate to="/instructor" replace />} />
      </Route>
    </Routes>
  );
}
