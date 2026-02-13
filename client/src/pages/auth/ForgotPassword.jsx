import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.success) {
        toast.success(res.data.message);
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-10 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600">
              If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The reset link will expire in 15 minutes for security reasons.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </Link>

            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Forgot Password?</h1>
          <p className="text-gray-500 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-900 font-medium hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;