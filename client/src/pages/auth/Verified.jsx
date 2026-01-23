import { CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Verified = () => {
  const [params] = useSearchParams();
  const status = params.get("status"); // success | already | failed
  const reason = params.get("reason"); // expired | invalid | notfound

  const content = (() => {
    if (status === "success") {
      return {
        icon: <CheckCircle2 className="w-14 h-14 text-green-600" />,
        title: "Email Verified!",
        message: "Your email has been verified successfully. You can now login.",
      };
    }
    if (status === "already") {
      return {
        icon: <MailCheck className="w-14 h-14 text-blue-700" />,
        title: "Already Verified",
        message: "Your email is already verified. You can login normally.",
      };
    }
    // failed
    const msg =
      reason === "expired"
        ? "Verification link expired. Please register again or request a new link."
        : reason === "notfound"
        ? "User not found. Please register again."
        : "Invalid verification link. Please try again.";
    return {
      icon: <XCircle className="w-14 h-14 text-red-600" />,
      title: "Verification Failed",
      message: msg,
    };
  })();

  return (
    <div className="mt-10 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">{content.icon}</div>

        <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
        <p className="text-gray-600 mt-2">{content.message}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition"
          >
            Go to Home
          </Link>

          <Link
            to="/login"
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verified;
