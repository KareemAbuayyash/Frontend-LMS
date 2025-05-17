// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Auth
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Sidebars
import Layout from './components/Layout/Layout';
import AdminSidebar from './Sidebar/AdminSidebar';
import InstructorSidebar from './Sidebar/InstructorSidebar';
import StudentSidebar from './Sidebar/StudentSidebar';

// Admin pages
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Courses from './pages/AdminDashboard/Courses';
import AdminUsers from './pages/AdminDashboard/Users';
import Enrollments from './pages/AdminDashboard/Enrollments';

// Instructor pages
import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/Courses';
import InstructorStudents from './pages/instructor/Students';
import InstructorAnalytics from './pages/instructor/Analytics';
import InstructorSettings from './pages/instructor/Settings';
import InstructorQuizzes from './pages/instructor/Quizzes';
import QuizSubmissions from './pages/instructor/QuizSubmissions';
import InstructorCourseContent from './pages/instructor/InstructorCourseContent';
import CreateOrEditAssignment from './pages/instructor/CreateOrEditAssignment';
import AssignmentSubmissions from './pages/instructor/AssignmentSubmissions';
// Student pages
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import StudentCourses from './pages/StudentDashboard/StudentCourses';
import Coursework from './pages/StudentDashboard/Coursework';
import StudentCourseDetails from './pages/StudentDashboard/StudentCourseDetails';
import QuizAttempt from './pages/StudentDashboard/QuizAttempt';
import ProfileSettings from './components/ProfileSettings/ProfileSettings';
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
            <Layout
              showSidebar={true}
              SidebarComponent={AdminSidebar}
            >
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses"     element={<Courses />} />
        <Route path="users"       element={<AdminUsers />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
                <Route path="settings" element={<ProfileSettings />} />

      </Route>

      {/* INSTRUCTOR */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout
              showSidebar={true}
              SidebarComponent={InstructorSidebar}
            >
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"   element={<InstructorDashboard />} />
        <Route path="courses"     element={<InstructorCourses />} />
        <Route path="assignments" element={<CreateOrEditAssignment />} />
        <Route path="create-assignment"      element={<CreateOrEditAssignment />} />
        <Route path="assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />
        <Route path="quizzes"     element={<InstructorQuizzes />} />
        <Route path="quiz-submissions" element={<QuizSubmissions />} />
        <Route path="students"    element={<InstructorStudents />} />
        <Route path="analytics"   element={<InstructorAnalytics />} />
        <Route path="settings"    element={<InstructorSettings />} />
        <Route path="*" element={<Navigate to="/instructor/dashboard" replace />} />
        <Route path="courses/:courseId/content"    element={<InstructorCourseContent />} />
        <Route path="courses/:courseId"         element={<StudentCourseDetails />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout
              showSidebar={true}
              SidebarComponent={StudentSidebar}
            >
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"  element={<StudentDashboard />} />
        <Route path="courses"    element={<StudentCourses />} />
        <Route path="coursework" element={<Coursework />} />
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        <Route path="courses/:courseId/quizzes/:quizId" element={<QuizAttempt />} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
