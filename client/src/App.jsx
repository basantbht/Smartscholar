import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChatBot from "./components/ChatBot";
import Footer from "./components/Footer";

import Home from "./pages/student/Home";
import Colleges from "./pages/student/Colleges";
import Courses from "./pages/student/Courses";
import Scholarships from "./pages/student/Scholarships";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verified from "./pages/auth/Verified";

import RoleRedirect from "./components/RoleRedirect";
import RoleGuard from "./components/RoleGuard";

import StudentLayout from "./layouts/StudentLayout";
import CollegeLayout from "./layouts/CollegeLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

import CollegeDashboard from "./pages/college/Dashboard";
import CollegeVerification from "./pages/college/Verification";
import CollegeApplications from "./pages/college/CollegeApplications";
import CollegeSessions from "./pages/college/Sessions";
import CollegeProfile from "./pages/college/Profile";
import CollegeSettings from "./pages/college/Settings";

import AdminDashboard from "./pages/Admin/Dashboard";
import AdminCollegeVerifications from "./pages/Admin/CollegeVerifications";
import AdminCollegeVerificationDetails from "./pages/Admin/CollegeVerificationDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNotifications from "./pages/admin/AdminNotifications";
import CollegesList from "./pages/admin/CollegesList";
import AdminSettings from "./pages/admin/AdminSettings";
import CollegeCourses from "./pages/college/CollegeCourses";
import CollegeEvents from "./pages/college/CollegeEvents";
import Events from "./pages/student/Events";
import SingleCollege from "./pages/student/SingleCollege";
import ScrollToTop from "./components/ScrollToTop";
import CollegeScholarships from "./pages/college/CollegeScholarships";
import SingleCollegeEvent from "./pages/student/SingleCollegeEvent";
import SingleCollegeScholarship from "./pages/student/SingleCollegeScholarship";
import SingleCollegeCourse from "./pages/student/SingleCollegeCourse";
import StudentProfile from "./pages/student/StudentProfile";
import EventsList from "./pages/college/EventsList";
import SearchResults from "./components/SearchResults";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  const location = useLocation();

  const hideScholarship = location.pathname.startsWith("/admin");
  const hideFooter = location.pathname.startsWith("/scholarships");

  // const hideFooterRoutes = ["/admin/login", "/admin/*"];
  // const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 999999 }}
      />

      <Routes>
        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verified" element={<Verified />} />
        </Route>

        {/* ✅ role decides dashboard */}
        <Route path="/redirect" element={<RoleRedirect />} />

        {/* PUBLIC STUDENT SITE */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/colleges/:id" element={<SingleCollege />} />
          <Route path="/colleges/:id/event/:eventId" element={<SingleCollegeEvent />} />
          <Route path="/colleges/:id/scholarship/:scholarshipId" element={<SingleCollegeScholarship />} />
          <Route path="/colleges/:id/course/:courseId" element={<SingleCollegeCourse />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* STUDENT DASHBOARD */}
        <Route element={<RoleGuard allowedRoles={["Student"]} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<Home />} />
          </Route>
        </Route>

        {/* COLLEGE DASHBOARD */}
        <Route element={<RoleGuard allowedRoles={["College"]} />}>
          <Route element={<CollegeLayout />}>
            <Route path="/college" element={<CollegeDashboard />} />
            <Route path="/college/verification" element={<CollegeVerification />} />
            <Route path="/college/courses" element={<CollegeCourses />} />
            <Route path="/college/scholarships" element={<CollegeScholarships />} />
            <Route path="/college/events" element={<CollegeEvents />} />
            <Route path="/college/sessions" element={<CollegeSessions />} />
            <Route path="/college/profile" element={<CollegeProfile />} />
            <Route path="/college/settings" element={<CollegeSettings />} />

            <Route path="/college/eventlist" element={<EventsList />} />
            <Route path="/events/:eventId/applications" element={<CollegeApplications />} />

          </Route>
        </Route>

        {/* ADMIN DASHBOARD */}
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

      <ChatBot />
      {!hideFooter && !hideScholarship && <Footer />}
    </>
  );
};

export default App;
