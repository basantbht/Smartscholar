import React, { useEffect, useState } from "react";
import {
  FileText,
  Heart,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  HourglassIcon,
  Building2,
  Calendar,
  Users,
  Eye,
  Search,
  ChevronRight,
  ChevronLeft,
  Home,
  User,
  Lock,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, loading, fetchMyEventApplications } = useUser();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
  }, [activeTab, currentPage, filter]);

  const loadApplications = async () => {
    try {
      const filters = {
        page: currentPage,
        limit: 10,
      };

      if (filter !== "all") {
        filters.status = filter;
      }

      const response = await fetchMyEventApplications(filters);

      if (response?.success) {
        setApplications(response.data.applications || []);
        setPaginationData(response.data.pagination);

        if (response.data.statistics) {
          setStats(response.data.statistics);
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(error.response?.data?.message || "Failed to fetch applications");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === "" ||
      app.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institution?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        icon: HourglassIcon,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Under Review",
      },
      approved: {
        icon: CheckCircle,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        label: "Rejected",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Dashboard Content
  const DashboardContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hi, {user?.name || "Basant Bhatt"}!
        </h1>
        <p className="text-gray-500">
          Let's explore the best courses and colleges for you.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Applications</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Bookmarks</p>
              <p className="text-4xl font-bold text-gray-900">1</p>
            </div>
            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unread Notifications</p>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-violet-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Applications Content
  const ApplicationsContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-500">Track and manage your college applications</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start applying to colleges and courses to see your applications here.
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Browse Colleges
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by event or institution..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("approved")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === "approved"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange("rejected")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === "rejected"
                      ? "bg-rose-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {application.event?.title || "Event Title"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {application.institution}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Applied{" "}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                          {application.isTeamRegistration && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              Team: {application.teamName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Event Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {application.event?.eventType || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Education Level
                    </p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {application.educationLevel?.replace(/_/g, " ") || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Fee</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {application.paymentAmount > 0
                        ? `₹${application.paymentAmount}`
                        : "Free"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">
                      Payment
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        application.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.paymentStatus === "completed"
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Rejection Reason */}
                {application.status === "rejected" &&
                  application.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-semibold text-red-900 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700">
                        {application.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Team Members */}
                {application.isTeamRegistration &&
                  application.teamMembers && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Team Members ({application.teamMembers.length + 1}):
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Leader:</span>{" "}
                          {user?.name} (You)
                        </p>
                        {application.teamMembers.map((member, idx) => (
                          <p key={idx} className="text-sm text-gray-700">
                            <span className="font-medium">
                              Member {idx + 1}:
                            </span>{" "}
                            {member.name} ({member.email})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/colleges/${application.event?.createdByCollege}/event/${application.event?._id}`
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Event
                  </button>
                  {application.reviewedAt && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      <Clock className="w-4 h-4" />
                      Reviewed{" "}
                      {new Date(application.reviewedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginationData && paginationData.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {[...Array(paginationData.totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === paginationData.totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                          currentPage === pageNumber
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationData.totalPages}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Profile Content
  const ProfileContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Full Name</p>
            <p className="text-base font-semibold text-gray-900">
              {user?.name || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Email</p>
            <p className="text-base font-semibold text-gray-900">
              {user?.email || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">Role</p>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {user?.role || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">
              Member Since
            </p>
            <p className="text-base font-semibold text-gray-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Bookmarks Content
  const BookmarksContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarks</h1>
        <p className="text-gray-500">Your saved courses and colleges</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookmarks yet
          </h3>
          <p className="text-gray-500">
            Save your favorite courses and colleges here.
          </p>
        </div>
      </div>
    </div>
  );

  // Notifications Content
  const NotificationsContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Notifications
        </h1>
        <p className="text-gray-500">Stay updated with your applications</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      </div>
    </div>
  );

  // Change Password Content
  const ChangePasswordContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Change Password
        </h1>
        <p className="text-gray-500">Update your account password</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "applications":
        return <ApplicationsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-0.5 px-3">
            {[
              { id: "dashboard", icon: Home, label: "Dashboard" },
              { id: "applications", icon: FileText, label: "My Applications" },
            
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
                  activeTab === item.id
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <button
            onClick={() => handleNavClick("change-password")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
              activeTab === "change-password"
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-500" />
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">
                  Back to Site
                </span>
              </button>
            </div>


          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;