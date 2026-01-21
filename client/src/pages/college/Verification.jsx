import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const docPresets = [
  "AffiliationLetter",
  "PAN",
  "RegistrationCertificate",
  "TaxClearance",
  "CollegeBrochure",
];

const CollegeVerification = () => {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [verification, setVerification] = useState(null);
  const [docTypes, setDocTypes] = useState(["AffiliationLetter"]);
  const [files, setFiles] = useState([]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/verification");
      setVerification(res.data?.data?.item || null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if already approved, go dashboard
    if (user?.verificationStatus === "approved") navigate("/college");
  }, [user, navigate]);

  const onFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  const handleSubmit = async () => {
    if (!files.length) return alert("Please select documents first.");

    setSubmitting(true);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("docs", f));
      // docTypes can be comma-separated OR array; your backend supports both
      form.append("docTypes", docTypes.join(","));

      await api.post("/college/verification/submit", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Submitted successfully. Admin will review.");
      await refresh();
      await fetchStatus();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Submit failed";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="mt-10 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl max-w-3xl w-full p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-900">College Verification</h1>
          <p className="text-gray-500 mt-1">
            Submit documents for admin approval. Status:{" "}
            <span className="font-semibold text-gray-800">{user?.verificationStatus}</span>
          </p>
        </div>

        {verification?.adminFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3">
            <AlertCircle className="text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Admin Feedback</p>
              <p className="text-red-700 text-sm">{verification.adminFeedback}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-2">Document Types</p>
            <p className="text-xs text-gray-500 mb-3">
              Select types (you can submit multiple). Order should match files if you want exact mapping.
            </p>

            <div className="flex flex-wrap gap-2">
              {docPresets.map((d) => {
                const active = docTypes.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() =>
                      setDocTypes((prev) =>
                        active ? prev.filter((x) => x !== d) : [...prev, d]
                      )
                    }
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      active
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-2">Upload Documents</p>

            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-white transition">
              <UploadCloud className="text-gray-500" />
              <span className="text-gray-600 text-sm">Choose files (PDF/Image)</span>
              <input type="file" multiple className="hidden" onChange={onFileChange} />
            </label>

            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
                <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                  {files.map((f) => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg flex justify-center items-center gap-2 transition disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit for Review"
          )}
        </button>
      </div>
    </div>
  );
};

export default CollegeVerification;
