import { Route, Routes, useLocation } from "react-router-dom";

import ChatBot from "./components/ChatBot";
import Footer from "./components/Footer";

import Home from "./pages/Student/Home";
import Universities from "./pages/Student/Univerisites";
import Colleges from "./pages/Student/Colleges";
import Courses from "./pages/Student/Courses";
import Degrees from "./pages/Student/Degrees";
import Admissions from "./pages/Student/Admissions";
import Scholarships from "./pages/Student/Scholarships";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import RoleRedirect from "./components/RoleRedirect";
import RoleGuard from "./components/RoleGuard";

import StudentLayout from "./layouts/StudentLayout";
import CollegeLayout from "./layouts/CollegeLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

import StudentDashboard from "./pages/Student/Dashboard";

import CollegeDashboard from "./pages/College/Dashboard";
import CollegeVerification from "./pages/College/Verification";
import CollegePosts from "./pages/College/Posts";
import CollegeApplications from "./pages/College/Applications";
import CollegeSessions from "./pages/College/Sessions";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminCollegeVerifications from "./pages/Admin/CollegeVerifications";
import AdminCollegeVerificationDetails from "./pages/Admin/CollegeVerificationDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNotifications from "./pages/admin/AdminNotifications";
import CollegesList from "./pages/admin/CollegesList";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  const location = useLocation();

  // ✅ hide footer on admin login page
  const hideFooterRoutes = ["/admin/login"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* AUTH (WITH NAVBAR) */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/redirect" element={<RoleRedirect />} />

        {/* PUBLIC STUDENT SITE */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/degrees" element={<Degrees />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/scholarships" element={<Scholarships />} />
        </Route>

        {/* STUDENT DASHBOARD */}
        <Route element={<RoleGuard allowedRoles={["Student"]} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* COLLEGE */}
        <Route element={<RoleGuard allowedRoles={["College"]} />}>
          <Route element={<CollegeLayout />}>
            <Route path="/college" element={<CollegeDashboard />} />
            <Route path="/college/verification" element={<CollegeVerification />} />
            <Route path="/college/posts" element={<CollegePosts />} />
            <Route
              path="/college/applications"
              element={<CollegeApplications />}
            />
            <Route path="/college/sessions" element={<CollegeSessions />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<RoleGuard allowedRoles={["Admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/verifications" element={<AdminCollegeVerifications />} />
            <Route
              path="/admin/verifications/:collegeId"
              element={<AdminCollegeVerificationDetails />}
            />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/colleges" element={<CollegesList />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* ADMIN LOGIN (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>

      {/* global widgets */}
      <ChatBot />
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
