import {
  LayoutDashboard,
  FileCheck2,
  ClipboardList,
  Megaphone,
  CalendarDays,
  GraduationCap,
  Award,
  MessageCircle,
  Settings,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/college" },
  { label: "Verification", icon: FileCheck2, to: "/college/verification" },
  { label: "Posts", icon: Megaphone, to: "/college/posts" },
  { label: "Applications", icon: ClipboardList, to: "/college/applications" },
  { label: "Sessions", icon: MessageCircle, to: "/college/sessions" },

  // future pages (you can create later)
  { label: "Events", icon: CalendarDays, to: "/college/posts?tab=events" },
  { label: "Courses", icon: GraduationCap, to: "/college/posts?tab=courses" },
  { label: "Scholarships", icon: Award, to: "/college/posts?tab=scholarships" },
];

const CollegeSidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  const isApproved = user?.verificationStatus === "approved";

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
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
                <p className="font-bold text-blue-900 leading-tight">College Panel</p>
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

          {!isApproved && (
            <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-800">Verification required</p>
              <p className="text-xs text-yellow-700 mt-1">
                You can submit posts after approval. Go to Verification to upload documents.
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="px-3 py-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Menu
          </p>

          <div className="mt-3 space-y-1">
            {items.map((it) => {
              const Icon = it.icon;

              // Lock some pages until approved
              const locked =
                !isApproved &&
                (it.to.startsWith("/college/posts") ||
                  it.to.startsWith("/college/applications") ||
                  it.to.startsWith("/college/sessions"));

              return (
                <NavLink
                  key={it.label}
                  to={locked ? "/college/verification" : it.to}
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

                  {locked && (
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      Locked
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-4">
            <NavLink
              to="/college/settings"
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

export default CollegeSidebar;
