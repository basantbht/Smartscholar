import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCollege } from "../../context/CollegeContext";
import { useEffect } from "react";

const CollegeDashboard = () => {
  const { user } = useAuth();
  const { fetchVerification, verification } = useCollege();

  useEffect(() => {
    fetchVerification();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="mt-10 max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">College Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${getStatusColor(user?.verificationStatus)}`}>
            <span className="font-semibold capitalize">{user?.verificationStatus}</span>
          </div>
        </div>

        {user?.verificationStatus === "notSubmitted" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ Please submit your verification documents to access all features.
            </p>
          </div>
        )}

        {user?.verificationStatus === "rejected" && verification?.item?.adminFeedback && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Verification Rejected</p>
            <p className="text-red-700 mt-2">{verification.item.adminFeedback}</p>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link
            className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            to="/college/posts"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              Manage Posts
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Courses, Events, Hackathons, Scholarships
            </p>
          </Link>

          <Link
            className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            to="/college/applications"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              View Applications
            </h3>
            <p className="text-gray-600 text-sm mt-1">Review student applications</p>
          </Link>

          <Link
            className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            to="/college/sessions"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              Session Requests
            </h3>
            <p className="text-gray-600 text-sm mt-1">Manage student counseling sessions</p>
          </Link>

          <Link
            className="p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            to="/college/verification"
          >
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              Verification & Feedback
            </h3>
            <p className="text-gray-600 text-sm mt-1">Upload documents and check status</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
