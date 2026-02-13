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
  Users,
  Globe,
  DollarSign,
  CheckCircle,
  XCircle,
  HourglassIcon,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useEvents } from "../../context/EventContext";
import EventApplicationModal from "../../components/modals/Eventapplicationmodal";
import { api } from "../../utils/api";

const SingleCollegeEvent = () => {
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const { fetchCollegeById, selectedCollege, loading: userLoading, user } = useUser();
  const { applyForEvent } = useEvents();
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(true);

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

  // Check if user has already applied for this event
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!eventId || !user) {
        setCheckingApplication(false);
        return;
      }

      try {
        setCheckingApplication(true);
        const response = await api.get(`/events/${eventId}/my-application`);
        if (response.data?.success && response.data?.data?.application) {
          setExistingApplication(response.data.data.application);
        }
      } catch (error) {
        // If 404, user hasn't applied yet - this is fine
        if (error.response?.status !== 404) {
          console.error("Error checking application:", error);
        }
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [eventId, user]);

  const college = selectedCollege?.college || selectedCollege;
  const collegeProfile = college?.collegeProfile;
  const event = collegeProfile?.events?.find((e) => e._id === eventId);

  const handleApplyForEvent = () => {
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (formData) => {
    setApplicationLoading(true);
    try {
      await applyForEvent(eventId, formData);
      setShowApplicationModal(false);
      // Refresh the application status
      const response = await api.get(`/events/${eventId}/my-application`);
      if (response.data?.success && response.data?.data?.application) {
        setExistingApplication(response.data.data.application);
      }
    } catch (error) {
      console.error("Application error:", error);
    } finally {
      setApplicationLoading(false);
    }
  };

  if (userLoading || checkingApplication) {
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

  // Calculate event status
  const now = new Date();
  const registrationDeadline = new Date(event.registrationDeadline);
  const isRegistrationOpen = now <= registrationDeadline;
  const isFull = event.maxParticipants && event.currentParticipants >= event.maxParticipants;
  const availableSeats = event.maxParticipants ? event.maxParticipants - event.currentParticipants : null;

  // Determine if user can apply
  const hasApplied = !!existingApplication;
  const applicationStatus = existingApplication?.status;
  const canApply = !hasApplied && isRegistrationOpen && !isFull;

  // Get status styling
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-900",
          iconColor: "text-emerald-600",
          label: "Application Approved",
          description: "Your application has been approved! You're registered for this event.",
        };
      case "rejected":
        return {
          icon: XCircle,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-900",
          iconColor: "text-red-600",
          label: "Application Rejected",
          description: existingApplication?.rejectionReason || "Your application was not accepted.",
        };
      case "pending":
      default:
        return {
          icon: HourglassIcon,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-900",
          iconColor: "text-yellow-600",
          label: "Application Pending",
          description: "Your application is under review by the event organizers.",
        };
    }
  };

  const statusConfig = hasApplied ? getStatusConfig(applicationStatus) : null;

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
      <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
        {event.thumbnail && (
          <>
            <img
              src={event.thumbnail}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/90 via-blue-700/90 to-indigo-700/90" />
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
            {event.registrationFee > 0 && (
              <span className="px-4 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-300/30 font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                ₹{event.registrationFee}
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
            {/* Application Status Alert */}
            {hasApplied && statusConfig && (
              <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-2xl p-6`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${statusConfig.bgColor} ${statusConfig.iconColor}`}>
                    <statusConfig.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${statusConfig.textColor} mb-1`}>
                      {statusConfig.label}
                    </h3>
                    <p className={`text-sm ${statusConfig.textColor} opacity-90`}>
                      {statusConfig.description}
                    </p>
                    {existingApplication?.isTeamRegistration && (
                      <div className="mt-3 pt-3 border-t border-current/20">
                        <p className={`text-sm font-medium ${statusConfig.textColor}`}>
                          Team Name: {existingApplication.teamName}
                        </p>
                        <p className={`text-xs ${statusConfig.textColor} opacity-75 mt-1`}>
                          Team Size: {(existingApplication.teamMembers?.length || 0) + 1} members
                        </p>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <p className={`text-xs ${statusConfig.textColor} opacity-75`}>
                        Applied on: {new Date(existingApplication.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Status Alert */}
            {!hasApplied && !isRegistrationOpen && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Registration Closed</p>
                  <p className="text-sm text-red-700 mt-1">
                    The registration deadline has passed.
                  </p>
                </div>
              </div>
            )}

            {!hasApplied && isFull && isRegistrationOpen && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900">Event Full</p>
                  <p className="text-sm text-orange-700 mt-1">
                    This event has reached maximum capacity.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {event.description || "No description available."}
              </p>
            </div>

            {/* Eligibility */}
            {event.eligibility && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Eligibility Criteria
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {event.eligibility}
                </p>
              </div>
            )}

            {/* Prizes */}
            {event.prizes && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Prizes & Rewards
                </h2>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {event.prizes}
                </p>
              </div>
            )}

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

                {/* Registration Deadline */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Registration Deadline
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.registrationDeadline
                        ? new Date(event.registrationDeadline).toLocaleDateString("en-US", {
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

                {/* Participants */}
                {event.maxParticipants && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Participants
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {event.currentParticipants} / {event.maxParticipants}
                        {availableSeats !== null && (
                          <span className="text-emerald-600 ml-2">
                            ({availableSeats} seats left)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Registration Fee */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Registration Fee
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {event.registrationFee > 0 ? `₹${event.registrationFee}` : "Free"}
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

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              {hasApplied ? (
                <button
                  disabled
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed ${
                    applicationStatus === "approved"
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                      : applicationStatus === "rejected"
                      ? "bg-red-100 text-red-700 border-2 border-red-300"
                      : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                  }`}
                >
                  {applicationStatus === "approved" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Already Registered
                    </>
                  ) : applicationStatus === "rejected" ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      Application Rejected
                    </>
                  ) : (
                    <>
                      <HourglassIcon className="w-5 h-5" />
                      Application Submitted
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleApplyForEvent}
                  disabled={!canApply}
                  className="w-full bg-linear-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                >
                  {isFull ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Event Full
                    </>
                  ) : !isRegistrationOpen ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Registration Closed
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      Apply for Event
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => navigate(`/colleges/${id}`)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                View College Profile
              </button>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <EventApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        event={event}
        onSubmit={handleSubmitApplication}
        loading={applicationLoading}
      />
    </div>
  );
};

export default SingleCollegeEvent;