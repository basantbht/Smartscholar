// components/RoleGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust to your auth hook/context

export default function RoleGuard({ allowedRoles = [] }) {
  const { user, loading } = useAuth(); 
  const location = useLocation();

  if (loading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    // if logged in but wrong role
    return <Navigate to="/redirect" replace />;
  }

  return <Outlet />;
}
