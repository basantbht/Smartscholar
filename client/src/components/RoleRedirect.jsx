// components/RoleRedirect.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "Admin") return <Navigate to="/admin" replace />;
  if (user.role === "College") return <Navigate to="/college" replace />;
  return <Navigate to="/student" replace />;
}
