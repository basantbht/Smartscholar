import { useEffect, useState } from "react";
import { useCollege } from "../../context/CollegeContext";
import { useAuth } from "../../context/AuthContext";

const DOCUMENT_TYPES = [
  { value: "PAN", label: "PAN Card" },
  { value: "RegistrationCertificate", label: "Registration Certificate" },
  { value: "AffiliationLetter", label: "Affiliation Letter" },
  { value: "TaxDocument", label: "Tax Document" },
  { value: "AddressProof", label: "Address Proof" },
  { value: "AuthorityLetter", label: "Authority Letter" },
  { value: "TrustDeed", label: "Trust Deed" },
];

const Verification = () => {
  const { verification, fetchVerification, submitVerification, loading } = useCollege();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [docTypes, setDocTypes] = useState([]);

  useEffect(() => {
    fetchVerification();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setDocTypes(new Array(selectedFiles.length).fill(""));
  };

  const handleDocTypeChange = (index, value) => {
    const newDocTypes = [...docTypes];
    newDocTypes[index] = value;
    setDocTypes(newDocTypes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one document");
      return;
    }

    if (docTypes.some((type) => !type)) {
      alert("Please select a document type for all files");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("docs", file);
    });
    formData.append("docTypes", docTypes.join(","));

    await submitVerification(formData);
    setFiles([]);
    setDocTypes([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-blue-900">Verification Status</h1>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <p className="text-xl font-semibold text-blue-900 capitalize">
                {user?.verificationStatus}
              </p>
            </div>
          </div>

          {verification?.item?.adminFeedback && (
            <div className="mt-4 p-3 bg-white rounded border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">Admin Feedback:</p>
              <p className="text-gray-600 mt-1">{verification.item.adminFeedback}</p>
            </div>
          )}
        </div>

        {verification?.item?.docs && verification.item.docs.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Submitted Documents</h3>
            <div className="space-y-2">
              {verification.item.docs.map((doc, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{doc.docType}</p>
                    <p className="text-sm text-gray-600">{doc.originalName}</p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            {verification?.item ? "Resubmit Documents" : "Submit Verification Documents"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents (Max 10)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {files.map((file, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">{file.name}</p>
                <select
                  value={docTypes[idx] || ""}
                  onChange={(e) => handleDocTypeChange(idx, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Document Type</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Submitting..." : "Submit Documents"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Required Documents:</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {DOCUMENT_TYPES.map((type) => (
              <li key={type.value}>• {type.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verification;
