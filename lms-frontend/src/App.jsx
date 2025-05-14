// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Authentication
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts & Sidebars
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
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ADMIN */}
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

      {/* INSTRUCTOR */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar sidebarComponent={InstructorSidebar}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"  element={<InstructorDashboard />} />
        <Route path="courses"    element={<InstructorCourses />} />
        <Route path="submissions" element={<InstructorSubmissions />} />
        <Route path="students"    element={<InstructorStudents />} />
        <Route path="analytics"   element={<InstructorAnalytics />} />
        <Route path="settings"    element={<InstructorSettings />} />
        <Route path="*" element={<Navigate to="/instructor/dashboard" replace />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar sidebarComponent={StudentSidebar}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        {/* Dashboard, Courses, Grades, Coursework */}
        <Route path="dashboard"  element={<StudentDashboard />} />
        <Route path="courses"    element={<StudentCourses />} />
        <Route path="coursework" element={<Coursework />} />

        {/* Course details: assignments + quizzes */}
        <Route
          path="courses/:courseId"
          element={<StudentCourseDetails />}
        />

        {/* Quiz attempt under a specific course */}
        <Route
          path="courses/:courseId/quizzes/:quizId"
          element={<QuizAttempt />}
        />

        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
