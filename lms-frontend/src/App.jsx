import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Authentication
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import Layout from "./components/Layout/Layout";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Courses         from "./pages/AdminDashboard/Courses";
import AdminUsers      from "./pages/AdminDashboard/Users";
import Enrollments     from "./pages/AdminDashboard/Enrollments";

// Student pages
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import StudentCourses from "./pages/StudentDashboard/StudentCourses";
import StudentGrades from "./pages/StudentDashboard/StudentGrades";
import Coursework from "./pages/StudentDashboard/Coursework";

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

      {/* Student section */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar>
              <StudentCourses />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar>
              <StudentGrades />
            </Layout>
          </ProtectedRoute>
        }
      />
        <Route
        path="/student/coursework"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar>
              <Coursework />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}