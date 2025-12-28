import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: "Universities", path: "/universities" },
  { name: "Colleges", path: "/colleges" },
  { name: "Courses", path: "/courses" },
  { name: "Degrees", path: "/degrees" },
  { name: "Admissions", path: "/admissions" },
  { name: "Scholarships", path: "/scholarships" },
];

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-8 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">

        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-12">

          {/* Logo */}
          <div className="w-36">
            <Link to={'/'}>
              <img src="/smartscholar-logo.png" alt="Logo" className="w-full h-auto" />
            </Link>
          </div>

          {/* Nav links */}
          <div className='hidden md:flex gap-6 font-medium text-gray-700 text-[1.02rem]'>
          {
            navItems.map((item) => {
              return (
                <Link key={item.name} to={item.path}>
                  <p className='hover:text-blue-900 cursor-pointer transition-colors duration-200'>{item.name}</p>
                </Link>
              )
            })
          }
          </div>

        </div>

        {/* Right: Login & Signup */}
        <div className="flex gap-4">
          <Link to="/login">
            <button className="px-4 py-2 cursor-pointer rounded-md border border-blue-900 text-blue-900 font-medium hover:bg-blue-50 transition-colors duration-200">
              Sign in
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 cursor-pointer py-2 rounded-md bg-blue-900 text-white font-medium hover:bg-blue-800 transition-colors duration-200">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
