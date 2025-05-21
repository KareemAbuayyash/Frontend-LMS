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
import AdminDashboard from './pages/admin/AdminDashboard';
import Courses       from './pages/admin/Courses';
import AdminUsers    from './pages/admin/Users';
import Enrollments   from './pages/admin/Enrollments';
import AdminProfileSettings from './pages/admin/AdminProfileSettings';

// Instructor pages
import InstructorDashboard       from './pages/instructor/Dashboard';
import InstructorCourses         from './pages/instructor/Courses';
import InstructorQuizzes         from './pages/instructor/Quizzes';
import QuizSubmissions           from './pages/instructor/QuizSubmissions';
import InstructorCourseContent   from './pages/instructor/InstructorCourseContent';
import CreateOrEditAssignment    from './pages/instructor/CreateOrEditAssignment';
import AssignmentSubmissions     from './pages/instructor/AssignmentSubmissions';
import InstructorProfileSettings from './pages/instructor/InstructorProfileSettings';

// Student pages
import StudentDashboard         from './pages/StudentDashboard/StudentDashboard';
import StudentCourses           from './pages/StudentDashboard/StudentCourses';
import Coursework               from './pages/StudentDashboard/Coursework';
import StudentCourseDetails     from './pages/StudentDashboard/StudentCourseDetails';
import QuizAttempt              from './pages/StudentDashboard/QuizAttempt';
import StudentAssignmentDetail  from './pages/StudentDashboard/StudentAssignmentDetails';
import StudentProfileSettings   from './pages/StudentDashboard/StudentProfileSettings';

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
            <Layout showSidebar SidebarComponent={AdminSidebar}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="settings" element={<AdminProfileSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* INSTRUCTOR */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="ROLE_INSTRUCTOR">
            <Layout showSidebar SidebarComponent={InstructorSidebar}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="courses" element={<InstructorCourses />} />
        <Route path="assignments" element={<CreateOrEditAssignment />} />
        <Route path="create-assignment" element={<CreateOrEditAssignment />} />
        <Route path="assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />
        <Route path="quizzes" element={<InstructorQuizzes />} />
        <Route path="quiz-submissions" element={<QuizSubmissions />} />
        <Route path="courses/:courseId/content" element={<InstructorCourseContent />} />
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        <Route path="settings" element={<InstructorProfileSettings />} />
        <Route path="*" element={<Navigate to="/instructor/dashboard" replace />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="ROLE_STUDENT">
            <Layout showSidebar SidebarComponent={StudentSidebar}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="coursework" element={<Coursework />} />
        <Route path="courses/:courseId" element={<StudentCourseDetails />} />
        <Route path="courses/:courseId/quizzes/:quizId" element={<QuizAttempt />} />
        <Route
          path="courses/:courseId/assignments/:assignmentId"
          element={<StudentAssignmentDetail />}
        />
        <Route path="settings" element={<StudentProfileSettings />} />
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
