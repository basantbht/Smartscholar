import { useEffect, useState } from "react";
import { useCollege } from "../../context/CollegeContext";

const Applications = () => {
  const { applications, fetchApplications, reviewApplication, loading } = useCollege();
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!action) return;
    await reviewApplication(selectedApp._id, action, feedback);
    setSelectedApp(null);
    setFeedback("");
    setAction("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "needsFix":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Student Applications</h1>

        {applications.length === 0 ? (
          <p className="text-gray-600">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {app.student?.name}
                    </h3>
                    <p className="text-sm text-gray-600">{app.student?.email}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-medium">Post:</span> {app.post?.title} (
                      {app.post?.postType})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {app.submittedDocs.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.submittedDocs.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                        >
                          {doc.docName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {app.status === "submitted" && (
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Review Application
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Review Application</h2>
            <p className="text-gray-700 mb-4">
              Student: <span className="font-semibold">{selectedApp.student?.name}</span>
            </p>

            <form onSubmit={handleReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Action</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                  <option value="needsFix">Needs Fix</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Provide feedback to the student..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(null);
                    setFeedback("");
                    setAction("");
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;