// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("bca_admin_auth") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
