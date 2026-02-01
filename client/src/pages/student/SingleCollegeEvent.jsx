import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CalendarDays,
  Building2,
  ExternalLink,
  Users,
  Globe,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

const SingleCollegeEvent = () => {
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const { fetchCollegeById, selectedCollege, loading } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setError(null);
        await fetchCollegeById(id);
      } catch (err) {
        setError("Failed to load event details. Please try again.");
        console.error(err);
      }
    };

    if (id) loadCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const college = selectedCollege?.college || selectedCollege;
  const collegeProfile = college?.collegeProfile;
  const event = collegeProfile?.events?.find((e) => e._id === eventId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error" : "Event Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The event you're looking for doesn't exist."}
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

      {/* Event Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
        {event.thumbnail && (
          <>
            <img
              src={event.thumbnail}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-indigo-700/90" />
          </>
        )}

        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 text-blue-100 mb-4">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">{collegeProfile?.collegeName}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white">
            <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 font-medium">
              {event.eventType}
            </span>
            {event.isOnline && (
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-300/30 font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Online Event
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {event.description || "No description available."}
              </p>
            </div>

            {/* Thumbnail Image */}
            {event.thumbnail && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Event Image
                </h2>
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Event Details
              </h3>

              <div className="space-y-4">
                {/* Start Date */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Start Date
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* End Date */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      End Date
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.endDate
                        ? new Date(event.endDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Venue
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.venue || "To be announced"}
                    </p>
                  </div>
                </div>

                {/* Event Type */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Event Type
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.eventType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <button
                onClick={() => navigate(`/colleges/${id}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                View College Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCollegeEvent;