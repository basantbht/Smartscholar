import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { Link } from "react-router-dom";

const AdminCollegeVerifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/college-verifications/pending");
      setItems(res.data?.data?.items || []);
    } catch (e) {
      console.log(e);
      alert("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Pending College Verifications</h1>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">College</th>
              <th className="p-4">Email</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t">
                <td className="p-4">{it.college?.name}</td>
                <td className="p-4">{it.college?.email}</td>
                <td className="p-4">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="p-4">
                  <Link
                    className="text-blue-900 font-medium hover:underline"
                    to={`/admin/verifications/${it.college?._id}`}
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  No pending verifications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCollegeVerifications;
