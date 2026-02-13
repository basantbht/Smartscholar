import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, GraduationCap, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Colleges", path: "/colleges" },
  { name: "Courses", path: "/courses" },
  { name: "Scholarships", path: "/scholarships" },
  { name: "Events", path: "/events" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActivePage = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smartscholar
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = isActivePage(item.path);
              return (
                <Link key={item.name} to={item.path}>
                  <div className="relative group h-full flex items-center">
                    <span className="text-gray-700 font-medium transition-colors duration-200 group-hover:text-blue-600">
                      {item.name}
                    </span>
                    {/* Animated underline - expands from center on hover, instant hide when not active */}
                    <div
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-blue-600 ${isActive
                          ? 'w-full'
                          : 'w-0 group-hover:w-full group-hover:transition-all group-hover:duration-300'
                        }`}
                    ></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <button className="px-5 py-2.5 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200">
                    Sign in
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {getUserInitials()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                    }`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fadeIn">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {user.role}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {user.role !== "Student" && (
                        <Link to="/redirect" onClick={() => setDropdownOpen(false)}>
                          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-3">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>
                        </Link>
                      )}

                      <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-3">
                          <User className="w-4 h-4" />
                          My Profile
                        </button>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 border-t border-gray-100 mt-1 pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = isActivePage(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                          ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                      {item.name}
                    </button>
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-gray-100 space-y-2">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200">
                        Sign in
                      </button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md">
                        Sign up
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* User Info Mobile */}
                    <div className="px-4 py-3 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-medium">
                        {user.role}
                      </span>
                    </div>

                    {user.role !== "Student" && (
                      <Link to="/redirect" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center gap-3">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </button>
                      </Link>
                    )}

                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center gap-3">
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-all duration-200 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;