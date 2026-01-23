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
  const [files, setFiles] = useState({});

  useEffect(() => {
    fetchVerification();
  }, []);

  const handleFileChange = (docType, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles((prev) => ({
        ...prev,
        [docType]: selectedFile,
      }));
    }
  };

  const handleRemoveFile = (docType) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[docType];
      return newFiles;
    });
    // Reset the file input
    const fileInput = document.getElementById(`file-${docType}`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileEntries = Object.entries(files);
    if (fileEntries.length === 0) {
      alert("Please upload at least one document");
      return;
    }

    // Check if all required documents are uploaded
    const uploadedDocTypes = new Set(fileEntries.map(([docType]) => docType));
    const missingDocs = DOCUMENT_TYPES.filter(
      (doc) => !uploadedDocTypes.has(doc.value)
    );

    if (missingDocs.length > 0) {
      const missingNames = missingDocs.map((doc) => doc.label).join(", ");
      if (
        !confirm(
          `You haven't uploaded: ${missingNames}. Do you want to submit anyway?`
        )
      ) {
        return;
      }
    }

    const formData = new FormData();
    const docTypes = [];

    fileEntries.forEach(([docType, file]) => {
      formData.append("docs", file);
      docTypes.push(docType);
    });

    formData.append("docTypes", docTypes.join(","));

    await submitVerification(formData);
    setFiles({});
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
              {verification.item.docs.map((doc, idx) => {
                const isPdf = doc.fileUrl?.toLowerCase().includes('.pdf') || 
                              doc.originalName?.toLowerCase().endsWith('.pdf');
                return (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.docType}</p>
                      <p className="text-sm text-gray-600">{doc.originalName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      >
                        {isPdf ? "View PDF" : "View"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            {verification?.item ? "Resubmit Documents" : "Submit Verification Documents"}
          </h3>

          <div className="space-y-4">
            {DOCUMENT_TYPES.map((docType) => (
              <div key={docType.value} className="p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {docType.label} <span className="text-red-500">*</span>
                </label>
                {files[docType.value] ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">
                        {files[docType.value].name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(docType.value)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      id={`file-${docType.value}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(docType.value, e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG, JPEG, PNG
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(files).length === 0}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Submitting..." : "Submit Documents"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 mb-2">Required Documents:</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {DOCUMENT_TYPES.map((type) => (
              <li key={type.value} className="flex items-center space-x-2">
                <span>• {type.label}</span>
                {files[type.value] && (
                  <span className="text-green-600 font-medium">(Uploaded)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Verification;
