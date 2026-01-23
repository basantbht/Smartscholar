import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker - using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminCollegeVerificationDetails = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const fetchOne = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/college-verifications/${collegeId}`);
      setItem(res.data?.data?.item || null);
    } catch (e) {
      console.log(e);
      toast.error("Failed to load verification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  const review = async (action) => {
    // Require feedback for rejection
    if (action === "reject" && !feedback.trim()) {
      toast.error("Please provide feedback when rejecting the verification.");
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/admin/college-verifications/${collegeId}/review`, {
        action,
        adminFeedback: action === "reject" ? feedback : null,
      });
      toast.success(`College ${action === "approve" ? "approved" : "rejected"} successfully`);
      navigate("/admin/verifications");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(msg || "Failed to process verification");
    } finally {
      setSubmitting(false);
    }
  };

  const openViewer = (doc) => {
    setViewingDoc(doc);
    setPageNumber(1);
    setNumPages(null);
  };

  const closeViewer = () => {
    setViewingDoc(null);
    setPageNumber(1);
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const isPdf = (url, filename) => {
    return (
      url?.toLowerCase().includes('.pdf') ||
      filename?.toLowerCase().endsWith('.pdf') ||
      (url?.includes('cloudinary') && url?.includes('.pdf'))
    );
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
        <h2 className="font-semibold text-gray-800 mb-4">Verification Documents</h2>

        {item.docs && item.docs.length > 0 ? (
          <div className="space-y-3 mb-6">
            {item.docs.map((d) => {
              const docIsPdf = isPdf(d.fileUrl, d.originalName);
              
              return (
                <div key={d._id} className="flex justify-between items-center border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{d.docType}</p>
                    <p className="text-sm text-gray-500 mt-1">{d.originalName}</p>
                  </div>
                  <button
                    onClick={() => openViewer(d)}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {docIsPdf ? "View PDF" : "View Image"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">No documents submitted yet.</p>
          </div>
        )}

        <div className="mt-6 border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback for Rejection <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 font-normal ml-2">(Required when rejecting)</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Please provide specific feedback about what needs to be corrected or what documents are missing..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This feedback will be sent to the college to help them correct the issues.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            disabled={submitting}
            onClick={() => review("approve")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {submitting ? "Processing..." : "Approve"}
          </button>
          <button
            disabled={submitting || !feedback.trim()}
            onClick={() => review("reject")}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {submitting ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{viewingDoc.docType}</h3>
                <p className="text-sm text-gray-500">{viewingDoc.originalName}</p>
              </div>
              <button
                onClick={closeViewer}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {isPdf(viewingDoc.fileUrl, viewingDoc.originalName) ? (
                <div className="w-full flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <Document
                      file={viewingDoc.fileUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="flex items-center justify-center p-8 min-h-[400px]">
                          <div className="text-gray-500">Loading PDF...</div>
                        </div>
                      }
                      error={
                        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-red-600">
                          <p className="mb-2">Failed to load PDF</p>
                          <a
                            href={viewingDoc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Open in new tab
                          </a>
                        </div>
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        scale={1.5}
                        className="shadow-lg"
                      />
                    </Document>
                  </div>

                  {/* PDF Navigation */}
                  {numPages && numPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-white rounded-lg shadow">
                      <button
                        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        ← Previous
                      </button>
                      <span className="text-gray-700 font-medium">
                        Page {pageNumber} of {numPages}
                      </span>
                      <button
                        onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                        disabled={pageNumber >= numPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.originalName}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const errorDiv = e.target.nextElementSibling;
                      if (errorDiv) {
                        errorDiv.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="hidden flex-col items-center justify-center p-8 text-red-600 min-h-[400px]"
                    style={{ display: "none" }}
                  >
                    <p className="mb-2">Failed to load image</p>
                    <a
                      href={viewingDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollegeVerificationDetails;
