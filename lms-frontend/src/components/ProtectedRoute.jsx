// src/components/ProtectedRoute.tsx
import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, getUserRole } from "../utils/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = getAccessToken();
  const role = getUserRole();
  const location = useLocation();

  if (!token) {
    // not logged in
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // logged in but wrong role
    return <Navigate to={role === 'ROLE_ADMIN' ? '/admin' : '/student/dashboard'} replace />;
  }

  return children;
}
