// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("auth_role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
