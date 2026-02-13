import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  Building2,
  Users,
  GraduationCap,
  Award,
  Clock,
  IndianRupee,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

const SingleCollegeCourse = () => {
  const { id, courseId } = useParams();
  const navigate = useNavigate();
  const { fetchCollegeById, selectedCollege, loading } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setError(null);
        await fetchCollegeById(id);
      } catch (err) {
        setError("Failed to load course details. Please try again.");
        console.error(err);
      }
    };

    if (id) loadCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const college = selectedCollege?.college || selectedCollege;
  const collegeProfile = college?.collegeProfile;
  const course = collegeProfile?.courses?.find((c) => c._id === courseId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error" : "Course Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The course you're looking for doesn't exist."}
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

      {/* Course Hero */}
      <div className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/90 via-indigo-600/90 to-purple-700/90" />

        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-blue-100 mb-4">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">{collegeProfile?.collegeName}</span>
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {course.degree}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium">
                  {course.school}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 min-w-[200px]">
              <p className="text-blue-100 text-sm font-medium mb-2">
                Available Seats
              </p>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-8 h-8" />
                <span className="text-4xl font-bold">{course.seats || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Overview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Course Overview
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  This {course.degree} program in {course.name} is offered by the {course.school} at {collegeProfile?.collegeName}. The course is designed to provide comprehensive knowledge and skills in the field.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Degree Type</h3>
                  </div>
                  <p className="text-gray-700">{course.degree}</p>
                </div>

                <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">School/Faculty</h3>
                  </div>
                  <p className="text-gray-700">{course.school}</p>
                </div>

                <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Total Seats</h3>
                  </div>
                  <p className="text-gray-700">{course.seats} seats available</p>
                </div>

                <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Program Type</h3>
                  </div>
                  <p className="text-gray-700">Full-time Program</p>
                </div>
              </div>
            </div>

            {/* Admission Process */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Admission Process
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Check Eligibility
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Review the eligibility criteria for this program. Ensure you meet all academic and other requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Prepare Documents
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Gather required documents including academic transcripts, certificates, ID proof, and passport-sized photographs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Submit Application
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Fill out the application form and submit it along with all required documents to the college admission office.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Entrance Exam & Interview
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Appear for any entrance exams if required and attend the interview session as scheduled.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Final Admission
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Once selected, complete the admission formalities and pay the required fees to confirm your seat.
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
                Course Information
              </h3>

              <div className="space-y-4">
                {/* Course Name */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Course Name
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {course.name}
                    </p>
                  </div>
                </div>

                {/* Degree */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Degree
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {course.degree}
                    </p>
                  </div>
                </div>

                {/* School */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      School/Faculty
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {course.school}
                    </p>
                  </div>
                </div>

                {/* Seats */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Available Seats
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                      {course.seats} seats
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* College Information */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About the College
              </h3>
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {collegeProfile?.description || "No description available."}
              </p>
              <button
                onClick={() => navigate(`/colleges/${id}`)}
                className="text-blue-600 font-medium text-sm hover:text-blue-700 transition flex items-center gap-1"
              >
                View Full Profile
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25">
                Apply Now
              </button>
              <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
                Download Brochure
              </button>
              <button
                onClick={() => navigate(`/colleges/${id}`)}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                View College
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">
                    Need Help?
                  </h4>
                  <p className="text-sm text-amber-800 mb-3">
                    Contact the college admission office for more information about this course.
                  </p>
                  {college?.email && (
                    <a
                      href={`mailto:${college.email}`}
                      className="text-sm font-medium text-amber-700 hover:text-amber-800 underline"
                    >
                      {college.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCollegeCourse;