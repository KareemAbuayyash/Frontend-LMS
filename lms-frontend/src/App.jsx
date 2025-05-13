// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Authentication
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import Layout from "./components/Layout/Layout";
import StudentSidebar from "./Sidebar/StudentSidebar";
import InstructorSidebar from "./Sidebar/InstructorSidebar";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Courses from "./pages/AdminDashboard/Courses";
import AdminUsers from "./pages/AdminDashboard/Users";
import Enrollments from "./pages/AdminDashboard/Enrollments";

// Student pages
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import StudentCourses from "./pages/StudentDashboard/StudentCourses";
import StudentGrades from "./pages/StudentDashboard/StudentGrades";
import Coursework from "./pages/StudentDashboard/Coursework";
import StudentCourseDetails from "./pages/StudentDashboard/StudentCourseDetails";
import QuizAttempt from "./pages/StudentDashboard/QuizAttempt";

// Instructor pages
import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorCourses from "./pages/instructor/Courses";
import InstructorSubmissions from "./pages/instructor/Submissions";
import InstructorStudents from "./pages/instructor/Students";
import InstructorAnalytics from "./pages/instructor/Analytics";
import InstructorSettings from "./pages/instructor/Settings";

// Error boundary
import ErrorBoundary from "./components/ErrorBoundary";

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
        <Route path="courses" element={<Courses />} />
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
        path="/instructor/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/courses"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorCourses />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/submissions"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorSubmissions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/students"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorStudents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/analytics"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorAnalytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/settings"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <InstructorSettings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student section */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <StudentCourses />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <StudentGrades />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/coursework"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <Coursework />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* course details (assignments + quizzes list) */}
      <Route
        path="/student/courses/:courseId"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <StudentCourseDetails />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* quiz attempt page */}
      <Route
        path="/student/courses/:courseId/quizzes/:quizId"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <QuizAttempt />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
