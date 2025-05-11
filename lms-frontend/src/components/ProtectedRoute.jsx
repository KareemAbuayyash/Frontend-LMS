/* ──────────────────────────────────────────────────────────────
   File: src/components/ProtectedRoute.tsx
   Guard for react-router routes
   ──────────────────────────────────────────────────────────── */

import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import {
  getAccessToken,
  getUserRole,
  isAccessTokenExpired,
  clearTokens,
} from "../utils/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const tokenMissingOrExpired = !getAccessToken() || isAccessTokenExpired();
  const role                  = getUserRole();
  const location              = useLocation();

  /* not logged-in OR token is stale → boot to /login */
  if (tokenMissingOrExpired) {
    clearTokens();
    localStorage.removeItem("username");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* logged-in but wrong role → send to generic dashboard */
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children:     PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};
