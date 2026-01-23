import {
  LayoutDashboard,
  BadgeCheck,
  Bell,
  Settings,
  ChevronRight,
  School,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin",
    end: true, // ✅ IMPORTANT: exact match only
  },
  {
    label: "College Verifications",
    icon: BadgeCheck,
    to: "/admin/verifications",
  },
  {
    label: "Notifications",
    icon: Bell,
    to: "/admin/notifications",
  },
  {
    label: "Colleges",
    icon: School,
    to: "/admin/colleges",
  },
];

const AdminSidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/smartscholar-logo.png"
                alt="SMARTSCHOLAR"
                className="w-10 h-10 rounded-lg object-contain"
              />
              <div>
                <p className="text-sm text-gray-500">SMARTSCHOLAR</p>
                <p className="font-bold text-blue-900 leading-tight">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close sidebar"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900">
              Review & Approve
            </p>
            <p className="text-xs text-blue-900/70 mt-1">
              Verify colleges and keep posted info trusted for students.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Menu
          </p>

          <div className="mt-3 space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <NavLink
                  key={it.label}
                  to={it.to}
                  end={it.end} // ✅ fix for dashboard active state
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-900 border border-blue-100"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{it.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Settings */}
          <div className="mt-6 border-t pt-4">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-900 border border-blue-100"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
