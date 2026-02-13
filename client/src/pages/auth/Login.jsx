import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  useEffect(() => {
    const passedRole = location.state?.role;
    if (passedRole === "College" || passedRole === "Student") {
      setFormData((prev) => ({ ...prev, role: passedRole }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ email verify redirect handler
  useEffect(() => {
    const verified = params.get("verified");
    const reason = params.get("reason");
    if (!verified) return;

    if (verified === "true") return navigate("/verified?status=success", { replace: true });
    if (verified === "already") return navigate("/verified?status=already", { replace: true });
    if (verified === "false") {
      return navigate(`/verified?status=failed&reason=${reason || "invalid"}`, {
        replace: true,
      });
    }
  }, [params, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required");
    }

    try {
      await login(formData);

      // ✅ role based redirect happens here
      navigate("/redirect", { replace: true });
    } catch {}
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>

          {formData.role === "College" && (
            <p className="mt-2 text-sm text-gray-500">
              Logging in as <span className="font-semibold">College</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              
            </div>
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


          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-60"
          >
            {loginLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Loading ...
              </>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="flex justify-end">
            <Link 
                to="/forgot-password" 
                className="text-sm text-blue-900 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
          </div>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-900 font-medium hover:underline">
              Create Account
            </Link>
          </p>

          {formData.role === "Student" && (
            <p className="text-gray-500 text-sm">
              Are you a College?{" "}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: "College" }));
                  toast.info("College login enabled");
                }}
                className="text-blue-900 font-medium hover:underline"
              >
                Login here
              </button>
            </p>
          )}

          {formData.role === "College" && (
            <p className="text-gray-500 text-sm">
              Login as Student instead?{" "}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: "Student" }))}
                className="text-blue-900 font-medium hover:underline"
              >
                Click here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;