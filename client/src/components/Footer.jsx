import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  Calendar,
  ArrowRight,
  Send,
  Heart
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const quickLinks = [
    { name: "Colleges", path: "/colleges", icon: Building2 },
    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Scholarships", path: "/scholarships", icon: Award },
    { name: "Events", path: "/events", icon: Calendar },
  ];

  const forSchools = [
    { name: "Register Your College", path: "/register?role=College" },
    { name: "College Dashboard", path: "/redirect" },
    { name: "Verification Process", path: "/verification" },
    { name: "Post Events", path: "/events/create" },
  ];

  const forStudents = [
    { name: "Find Colleges", path: "/colleges" },
    { name: "Browse Courses", path: "/courses" },
    { name: "Apply for Scholarships", path: "/scholarships" },
    { name: "Student Profile", path: "/profile" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", color: "hover:text-blue-600", bg: "group-hover:bg-blue-600" },
    { icon: Instagram, href: "https://instagram.com", color: "hover:text-pink-600", bg: "group-hover:bg-pink-600" },
    { icon: Linkedin, href: "https://linkedin.com", color: "hover:text-blue-700", bg: "group-hover:bg-blue-700" },
    { icon: Youtube, href: "https://youtube.com", color: "hover:text-red-600", bg: "group-hover:bg-red-600" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-white border-t border-gray-100 mt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smartscholar
                </span>
              </div>
            </Link>

            <p className="text-gray-600 leading-relaxed max-w-sm">
              Your comprehensive guide to higher education in Nepal. Discover colleges, explore courses, and unlock scholarship opportunities.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center transition-all duration-300 hover:shadow-md ${social.bg}`}>
                      <Icon className={`w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300`} />
                    </div>
                  </a>
                );
              })}
            </div>

          
          </div>

          {/* For Schools & Colleges */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              For Colleges
            </h4>
            <ul className="space-y-3">
              {forSchools.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-start gap-2 group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Students */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              For Students
            </h4>
            <ul className="space-y-3">
              {forStudents.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-start gap-2 group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Right Side */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-600 group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Address</p>
                  <p className="leading-relaxed">Gwarko, Lalitpur<br/>Nepal</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-gray-600 group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Phone</p>
                  <a href="tel:+97714155052" className="hover:text-blue-600 transition-colors">
                    +977-1-4155052
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-gray-600 group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email</p>
                  <a href="mailto:info@smartscholar.com" className="hover:text-blue-600 transition-colors break-all">
                    info@smartscholar.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright in Center */}
      <div className="relative border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            {/* Copyright - Center */}
            <p className="text-sm text-gray-600 font-medium">
              &copy; {new Date().getFullYear()} Smartscholar Pvt. Ltd. All rights reserved.
            </p>
            
            
          </div>
        </div>
      </div>
    </footer>
  );
}