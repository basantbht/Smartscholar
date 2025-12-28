import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { HiMail, HiPhone, HiArrowRight } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-5">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <div className="w-45">
              <Link to={'/'}>
                <img src="/smartscholar-logo.png" alt="Logo" className="w-full h-auto" />
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Your guide to education in Nepal!
          </p>

          <div className="flex gap-3 text-gray-600">
            <FaFacebookF className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-pink-500" />
            <FaLinkedinIn className="w-5 h-5 cursor-pointer hover:text-blue-700" />
            <FaYoutube className="w-5 h-5 cursor-pointer hover:text-red-600" />
            <HiArrowRight className="w-5 h-5 cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* Schools & Colleges */}
        <div>
          <h4 className="font-semibold mb-3">FOR SCHOOLS & COLLEGES</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Register your school/college</li>
          </ul>
        </div>

        {/* Students */}
        <div>
          <h4 className="font-semibold mb-3">FOR STUDENTS</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Colleges</li>
            <li>Courses</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">CONTACT</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Smartscholar Pvt. Ltd.</li>
            <li>Gwarko, Lalitpur</li>

            <li className="flex items-center gap-2">
              <HiPhone className="w-4 h-4" />
              +977-1-4155052
            </li>

            <li className="flex items-center gap-2">
              <HiMail className="w-4 h-4" />
              info@smartscholar.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4 text-sm text-gray-600 flex flex-col md:flex-row justify-center items-center px-6">
        <p>&copy; 2025 Smartscholar. All rights reserved.</p>
      </div>
    </footer>
  );
}
