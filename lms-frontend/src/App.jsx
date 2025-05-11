import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Authentication
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import Layout from "./components/Layout/Layout";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Courses from "./pages/AdminDashboard/Courses";
import AdminUsers from "./pages/AdminDashboard/Users";
import Enrollments from "./pages/AdminDashboard/Enrollments";

// User settings
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";

// Error boundary
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="courses" element={<Courses />} />
        <Route path="settings" element={<ProfileSettings />} />
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

      {/* Fallback to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}