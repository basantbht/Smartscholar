import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Building2,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  BookOpen,
  BadgeCheck,
  IndianRupee,
  Users,
  Award,
} from "lucide-react";
import { useUser } from "../../context/UserContext";

const Badge = ({ status }) => {
  const statusConfig = {
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Verified",
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: Clock,
      label: "Pending Verification",
    },
    rejected: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: AlertCircle,
      label: "Not Verified",
    },
  };

  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="w-4 h-4" />
      {cfg.label}
    </span>
  );
};

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
        : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{children}</span>
  </button>
);

const InfoRow = ({ icon: Icon, label, value, href, type = "text" }) => {
  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 break-words leading-relaxed">
          {value || "-"}
        </p>
      </div>
    </div>
  );

  if (href && type === "link") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:no-underline"
      >
        {content}
      </a>
    );
  }

  if (href && type === "email") {
    return (
      <a href={`mailto:${href}`} className="block hover:no-underline">
        {content}
      </a>
    );
  }

  if (href && type === "tel") {
    return (
      <a href={`tel:${href}`} className="block hover:no-underline">
        {content}
      </a>
    );
  }

  return content;
};

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2.5 rounded-lg border ${colors[color]} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

const MapEmbed = ({ address }) => {
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
      <iframe
        title="College Location"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

const SingleCollege = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCollegeById, selectedCollege, loading, clearSelectedCollege } =
    useUser();

  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const loadCollege = async () => {
      try {
        setError(null);
        await fetchCollegeById(id);
      } catch (err) {
        setError("Failed to load college details. Please try again.");
        console.error(err);
      }
    };

    if (id) loadCollege();
    return () => clearSelectedCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const college = selectedCollege?.college || selectedCollege;
  const collegeProfile = college?.collegeProfile;

  const courses = collegeProfile?.courses || [];
  const events = collegeProfile?.events || [];
  const scholarships = collegeProfile?.scholarships || [];

  const createdAtText = useMemo(() => {
    const d = college?.createdAt ? new Date(college.createdAt) : null;
    return d ? d.toLocaleDateString() : "-";
  }, [college?.createdAt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!college || !collegeProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">College not found</p>
      </div>
    );
  }

  const heroImage = collegeProfile?.image;
  const collegeName = collegeProfile?.collegeName || "College";
  const verificationStatus = college?.verificationStatus;
  const adminName = college?.name;
  const adminEmail = college?.email;
  const address = collegeProfile?.address;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <Badge status={verificationStatus} />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
        {heroImage && (
          <>
            <img
              src={heroImage}
              alt={collegeName}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-700/80 to-indigo-700/80" />
          </>
        )}
        
        <div className="relative max-w-[1600px] mx-auto px-6 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {collegeName}
            </h1>
            <p className="text-blue-100 text-lg">
              Managed by <span className="font-semibold text-white">{adminName}</span> • 
              Registered <span className="font-semibold text-white">{createdAtText}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              icon={BookOpen}
              label="Courses Offered"
              value={courses.length}
              color="blue"
            />
            <StatCard
              icon={CalendarDays}
              label="Upcoming Events"
              value={events.length}
              color="green"
            />
            <StatCard
              icon={BadgeCheck}
              label="Scholarships"
              value={scholarships.length}
              color="purple"
            />
            <StatCard
              icon={Users}
              label="Total Seats"
              value={courses.reduce((sum, c) => sum + (c.seats || 0), 0)}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-2">
              <TabButton
                active={tab === "overview"}
                onClick={() => setTab("overview")}
                icon={Building2}
              >
                Overview
              </TabButton>
              <TabButton
                active={tab === "courses"}
                onClick={() => setTab("courses")}
                icon={BookOpen}
              >
                Courses
              </TabButton>
              <TabButton
                active={tab === "events"}
                onClick={() => setTab("events")}
                icon={CalendarDays}
              >
                Events
              </TabButton>
              <TabButton
                active={tab === "scholarships"}
                onClick={() => setTab("scholarships")}
                icon={Award}
              >
                Scholarships
              </TabButton>
            </div>
          </aside>

          {/* Middle Content - Scrollable */}
          <main className="col-span-12 lg:col-span-7">
            <div className="space-y-6">
              {tab === "overview" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    About {collegeName}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {collegeProfile?.description || "No description available."}
                  </p>
                </div>
              )}

              {tab === "courses" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Courses Offered
                  </h2>
                  {courses.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((c) => (
                        <div
                          key={c._id}
                          onClick={() => navigate(`/colleges/${id}/course/${c._id}`)}
                          className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all bg-gradient-to-br from-white to-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                              {c.school}
                            </span>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                              {c.degree}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition">
                            {c.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{c.seats} seats available</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No courses listed.</p>
                  )}
                </div>
              )}

              {tab === "events" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CalendarDays className="w-6 h-6 text-blue-600" />
                    Events
                  </h2>
                  {events.length ? (
                    <div className="space-y-4">
                      {events.map((e) => (
                        <div
                          key={e._id}
                          onClick={() => navigate(`/colleges/${id}/event/${e._id}`)}
                          className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white cursor-pointer hover:border-blue-300"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 p-5">
                            {e.thumbnail ? (
                              <img
                                src={e.thumbnail}
                                alt={e.title}
                                className="w-full sm:w-32 h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full sm:w-32 h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-gray-200">
                                <CalendarDays className="w-8 h-8 text-blue-400" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                                  {e.title}
                                </h3>
                                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200 shrink-0">
                                  {e.eventType}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {e.description}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>
                                    Start: {e.startDate ? new Date(e.startDate).toLocaleDateString() : "-"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>
                                    End: {e.endDate ? new Date(e.endDate).toLocaleDateString() : "-"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{e.venue || "-"}</span>
                                </div>
                                {e.isOnline && (
                                  <span className="text-emerald-600 font-medium">● Online Event</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No events published.</p>
                  )}
                </div>
              )}

              {tab === "scholarships" && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    Scholarships
                  </h2>
                  {scholarships.length ? (
                    <div className="space-y-4">
                      {scholarships.map((s) => (
                        <div
                          key={s._id}
                          onClick={() => navigate(`/colleges/${id}/scholarship/${s._id}`)}
                          className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-gradient-to-br from-white to-amber-50/30 cursor-pointer hover:border-purple-200"
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-purple-600 transition">
                                {s.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
                                  {s.type}
                                </span>
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                                  {s.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                              <IndianRupee className="w-5 h-5" />
                              {s.amount?.toLocaleString() ?? "-"}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Eligibility
                              </p>
                              <p className="text-sm text-gray-900 line-clamp-2">{s.eligibility || "-"}</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                Deadline
                              </p>
                              <p className="text-sm text-gray-900">
                                {s.deadline ? new Date(s.deadline).toLocaleDateString() : "-"}
                              </p>
                            </div>
                          </div>

                          {s.description && (
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {s.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No scholarships available.</p>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Info & Map */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>

                <div className="space-y-1">
                  {address && (
                    <InfoRow icon={MapPin} label="Address" value={address} />
                  )}
                  {adminEmail && (
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={adminEmail}
                      href={adminEmail}
                      type="email"
                    />
                  )}
                  {collegeProfile?.phone && (
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={collegeProfile.phone}
                      href={collegeProfile.phone}
                      type="tel"
                    />
                  )}
                  {collegeProfile?.website && (
                    <InfoRow
                      icon={Globe}
                      label="Website"
                      value={collegeProfile.website}
                      href={collegeProfile.website}
                      type="link"
                    />
                  )}
                  {collegeProfile?.universityAffiliation && (
                    <InfoRow
                      icon={GraduationCap}
                      label="Affiliation"
                      value={collegeProfile.universityAffiliation}
                    />
                  )}
                </div>
              </div>

              {/* Map */}
              {address && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location
                  </h3>
                  <MapEmbed address={address} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/25">
                  Request Session
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
                  View Posts
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SingleCollege;