import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="mt-10">
      <div className="bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-blue-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Verify colleges and manage approvals.</p>

        <div className="mt-6">
          <Link className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800" to="/admin/verifications">
            College Verifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
