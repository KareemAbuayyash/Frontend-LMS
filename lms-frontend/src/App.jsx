import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Authentication
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import Layout from "./components/Layout/Layout";
import StudentLayout from "./components/Layout/StudentLayout";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Courses         from "./pages/AdminDashboard/Courses";
import Instructors     from "./pages/AdminDashboard/Instructors";
import AdminUsers      from "./pages/AdminDashboard/Users";
import Enrollments     from "./pages/AdminDashboard/Enrollments";


// Error boundary
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/"      element={<Navigate to="/login" replace />} />

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
        <Route path="instructors" element={
          <ErrorBoundary>
            <Instructors />
          </ErrorBoundary>
        }/>
        <Route path="users"       element={
          <ErrorBoundary>
            <AdminUsers />
          </ErrorBoundary>
        }/>
        <Route path="enrollments" element={
          <ErrorBoundary>
            <Enrollments />
          </ErrorBoundary>
        }/>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>


      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
