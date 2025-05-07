// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Courses from "./pages/AdminDashboard/Courses";
import Instructors from "./pages/AdminDashboard/Instructors";
import AdminUsers from "./pages/AdminDashboard/Users";
import Enrollments from "./pages/AdminDashboard/Enrollments";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* protected user route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout showSidebar={false}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* admin section */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Layout showSidebar>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <Layout showSidebar>
              <Courses />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/instructors"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <ErrorBoundary>
              <Layout showSidebar>
                <Instructors />
              </Layout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <ErrorBoundary>
              <Layout showSidebar>
                <AdminUsers />
              </Layout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/enrollments"
        element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <ErrorBoundary>
              <Layout showSidebar>
                <Enrollments />
              </Layout>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* catch-all to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
