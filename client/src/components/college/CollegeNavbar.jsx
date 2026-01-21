import { Bell, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CollegeNavbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();

  const statusBadge =
    user?.verificationStatus === "approved"
      ? "bg-green-100 text-green-700 border-green-200"
      : user?.verificationStatus === "rejected"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const statusText =
    user?.verificationStatus === "approved"
      ? "Approved"
      : user?.verificationStatus === "rejected"
      ? "Needs Fix"
      : "Pending";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div>
            <p className="text-sm text-gray-500">College Portal</p>
            <h1 className="text-lg font-bold text-blue-900 leading-tight">
              {user?.collegeName || user?.name || "College"}
            </h1>
          </div>

          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${statusBadge}`}
          >
            <ShieldCheck className="w-4 h-4" />
            {statusText}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-700" />
          </button>

          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default CollegeNavbar;
