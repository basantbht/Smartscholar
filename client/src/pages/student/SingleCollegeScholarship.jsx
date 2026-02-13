import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Award,
  Building2,
  IndianRupee,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

const SingleCollegeScholarship = () => {
  const { id, scholarshipId } = useParams();
  const navigate = useNavigate();
  const { fetchCollegeById, selectedCollege, loading } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setError(null);
        await fetchCollegeById(id);
      } catch (err) {
        setError("Failed to load scholarship details. Please try again.");
        console.error(err);
      }
    };

    if (id) loadCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const college = selectedCollege?.college || selectedCollege;
  const collegeProfile = college?.collegeProfile;
  const scholarship = collegeProfile?.scholarships?.find(
    (s) => s._id === scholarshipId
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading scholarship details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error" : "Scholarship Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The scholarship you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate(`/colleges/${id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Back to College
          </button>
        </div>
      </div>
    );
  }

  const deadlineDate = scholarship.deadline
    ? new Date(scholarship.deadline)
    : null;
  const isExpired = deadlineDate && deadlineDate < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`/colleges/${id}`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to {collegeProfile?.collegeName}</span>
          </button>
        </div>
      </header>

      {/* Scholarship Hero */}
      <div className="relative bg-linear-to-br from-purple-600 via-purple-700 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-600/90 via-purple-700/90 to-indigo-700/90" />

        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-purple-100 mb-4">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">{collegeProfile?.collegeName}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {scholarship.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium">
                  {scholarship.type}
                </span>
                <span
                  className={`px-4 py-2 rounded-full backdrop-blur-sm border font-medium ${
                    scholarship.status === "Active"
                      ? "bg-emerald-500/20 border-emerald-300/30 text-white"
                      : "bg-gray-500/20 border-gray-300/30 text-white"
                  }`}
                >
                  {scholarship.status}
                </span>
                {isExpired && (
                  <span className="px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-white font-medium">
                    Deadline Passed
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 min-w-[200px]">
              <p className="text-purple-100 text-sm font-medium mb-2">
                Scholarship Amount
              </p>
              <div className="flex items-center gap-2 text-white">
                <IndianRupee className="w-8 h-8" />
                <span className="text-4xl font-bold">
                  {scholarship.amount?.toLocaleString() ?? "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship Details */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {scholarship.description && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  About This Scholarship
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {scholarship.description}
                </p>
              </div>
            )}

            {/* Eligibility Criteria */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-purple-600" />
                Eligibility Criteria
              </h2>
              <div className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                  {scholarship.eligibility || "No specific eligibility criteria mentioned."}
                </p>
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How to Apply
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Review Eligibility
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Make sure you meet all the eligibility criteria mentioned above.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Prepare Documents
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Gather all required documents such as academic transcripts, ID proof, and financial statements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Submit Application
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Contact the college directly through the contact information provided to submit your application.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Wait for Response
                    </h3>
                    <p className="text-gray-600 text-sm">
                      The college will review your application and contact you with their decision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Information
              </h3>

              <div className="space-y-4">
                {/* Amount */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Amount
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                      ₹ {scholarship.amount?.toLocaleString() ?? "-"}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {scholarship.type}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {scholarship.status}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isExpired ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
                    {isExpired ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Application Deadline
                    </p>
                    <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                      {deadlineDate
                        ? deadlineDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not specified"}
                    </p>
                    {isExpired && (
                      <p className="text-xs text-red-600 mt-1">Deadline has passed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <button
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-600/25"
                disabled={isExpired}
              >
                {isExpired ? "Application Closed" : "Apply Now"}
              </button>
              <button
                onClick={() => navigate(`/colleges/${id}`)}
                className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                View College Profile
              </button>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Important Note
                  </h4>
                  <p className="text-sm text-amber-800">
                    Contact the college directly for the most up-to-date application procedures and requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCollegeScholarship;