import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRedirect = () => {
  const { user, meLoading } = useAuth();

  if (meLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "Student") return <Navigate to="/student" replace />;
  if (user.role === "College") return <Navigate to="/college" replace />;
  if (user.role === "Admin") return <Navigate to="/admin" replace />;

  return <Navigate to="/" replace />;
};

export default RoleRedirect;
