import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";

const AdminCollegeVerificationDetails = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchOne = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/college-verifications/${collegeId}`);
      setItem(res.data?.data?.item || null);
    } catch (e) {
      console.log(e);
      alert("Failed to load verification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  const review = async (action) => {
    setSubmitting(true);
    try {
      await api.put(`/admin/college-verifications/${collegeId}/review`, {
        action,
        adminFeedback: feedback,
      });
      alert(`College ${action}d`);
      navigate("/admin/verifications");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!item) return <div className="p-10 text-center text-gray-500">Not found</div>;

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Review College Verification</h1>
      <p className="text-gray-600 mb-6">
        <span className="font-semibold">{item.college?.name}</span> — {item.college?.email}
      </p>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Documents</h2>

        <div className="space-y-3">
          {item.docs?.map((d) => (
            <div key={d._id} className="flex justify-between items-center border rounded-xl p-4">
              <div>
                <p className="font-medium">{d.docType}</p>
                <p className="text-sm text-gray-500">{d.originalName}</p>
              </div>
              <a
                className="text-blue-900 font-medium hover:underline"
                href={`/${d.fileUrl.replace(/^.*uploads/, "uploads")}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (if rejecting)</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Mention missing docs or incorrect info..."
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={submitting}
            onClick={() => review("approve")}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            Approve
          </button>
          <button
            disabled={submitting}
            onClick={() => review("reject")}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCollegeVerificationDetails;
