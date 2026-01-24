import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { register, registerLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      // go to login after signup
      if (formData.role === "College") {
        navigate("/login", { replace: true, state: { role: "College" } });
      } else {
        navigate("/login", { replace: true });
      }
    } catch {}
  };

  return (
    <div className="mt-10 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Get started with SMARTSCHOLAR</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.role === "College" ? "Contact Person Name" : "Full Name"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"

                placeholder={formData.role === "College" ? "College Admin Name" : "Full Name"}

                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="you@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="*********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="*********"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword((s) => !s)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-60"
          >
            {registerLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading ...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-900 font-medium hover:underline">
              Login Here
            </Link>
          </p>

          {formData.role === "Student" && (
            <p className="text-gray-500 text-sm">
              Are you a College?{" "}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: "College" }));
                  toast.info("College registration enabled");
                }}
                className="text-blue-900 font-medium hover:underline"
              >
                Click here
              </button>
            </p>
          )}

          {formData.role === "College" && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>College accounts must submit verification documents after signup.</p>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "Student" }))}
                className="text-blue-900 font-medium hover:underline text-sm"
              >
                Register as Student instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
