import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Universities", path: "/universities" },
  { name: "Colleges", path: "/colleges" },
  { name: "Courses", path: "/courses" },
  { name: "Degrees", path: "/degrees" },
  { name: "Admissions", path: "/admissions" },
  { name: "Scholarships", path: "/scholarships" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="w-36">
            <Link to="/">
              <img
                src="/smartscholar-logo.png"
                alt="Logo"
                className="w-full h-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex gap-6 font-medium text-gray-700 text-[1.02rem]">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <p className="hover:text-blue-900 cursor-pointer transition-colors duration-200">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link to="/login">
                <button className="px-4 py-2 rounded-md border border-blue-900 text-blue-900 font-medium hover:bg-blue-50 transition-colors duration-200">
                  Sign in
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors duration-200">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600 hidden sm:block">
                <span className="font-semibold text-gray-800">
                  {user.name}
                </span>{" "}
                <span className="text-gray-400">({user.role})</span>
              </div>

              {user.role !== "Student" && (
                <Link to="/redirect">
                  <button className="px-4 py-2 rounded-md border border-blue-900 text-blue-900 font-medium hover:bg-blue-50 transition-colors duration-200">
                    Dashboard
                  </button>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
