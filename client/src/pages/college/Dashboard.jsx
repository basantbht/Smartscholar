import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CollegeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="mt-10">
      <div className="bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-blue-900">College Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Status: <span className="font-semibold">{user?.verificationStatus}</span>
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Link className="p-4 rounded-xl border hover:bg-gray-50" to="/college/posts">
            Manage Posts (Courses/Events/Hackathons/Scholarships)
          </Link>
          <Link className="p-4 rounded-xl border hover:bg-gray-50" to="/college/applications">
            View Applications
          </Link>
          <Link className="p-4 rounded-xl border hover:bg-gray-50" to="/college/sessions">
            Session Requests
          </Link>
          <Link className="p-4 rounded-xl border hover:bg-gray-50" to="/college/verification">
            Verification & Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
