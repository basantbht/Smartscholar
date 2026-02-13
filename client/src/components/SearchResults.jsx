import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  ChevronRight,
  Filter,
  Loader2,
  AlertCircle,
  GraduationCap,
  Clock,
  Users,
  Tag,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useCollege } from "../context/CollegeContext";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "all",      label: "All Results", icon: Search },
  { id: "colleges", label: "Colleges",    icon: Building2 },
  { id: "courses",  label: "Courses",     icon: BookOpen },
  { id: "events",   label: "Events",      icon: Calendar },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const highlight = (text = "", query = "") => {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-blue-100 text-blue-700 rounded px-0.5">{p}</mark>
      : p
  );
};

const matchesQuery = (obj, query) => {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return JSON.stringify(obj).toLowerCase().includes(q);
};

// ─── College Card ─────────────────────────────────────────────────────────────
const CollegeCard = ({ college, query, onClick }) => {
  const p = college.collegeProfile;
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-40 bg-linear-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {p?.image ? (
          <img src={p.image} alt={p?.collegeName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-14 h-14 text-blue-200" />
          </div>
        )}
        {college.verificationStatus === "approved" && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Verified
          </span>
        )}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          College
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
          {highlight(p?.collegeName || "College", query)}
        </h3>
        {p?.address && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{highlight(p.address, query)}</span>
          </p>
        )}
        <p className="text-sm text-slate-500 line-clamp-2 flex-1 leading-relaxed">
          {highlight(p?.description || "No description available", query)}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex gap-3 text-xs text-slate-400">
            <span>{p?.courses?.length || 0} courses</span>
            <span>·</span>
            <span>{p?.events?.length || 0} events</span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

// ─── Course Card ──────────────────────────────────────────────────────────────
const CourseCard = ({ course, query, onClick }) => {
  const levelColors = {
    undergraduate: "bg-blue-50 text-blue-700",
    postgraduate:  "bg-purple-50 text-purple-700",
    diploma:       "bg-green-50 text-green-700",
    certificate:   "bg-orange-50 text-orange-700",
  };
  const levelClass = levelColors[course.level?.toLowerCase()] || "bg-slate-50 text-slate-600";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
          Course
        </span>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
          {highlight(course.name || course.title || "Course", query)}
        </h3>
        {course.department && (
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
            <Tag className="w-3 h-3" />{highlight(course.department, query)}
          </p>
        )}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {highlight(course.description || "No description available", query)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-gray-50">
        {course.level && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelClass}`}>
            {course.level}
          </span>
        )}
        {course.duration && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />{course.duration}
          </span>
        )}
        {course.fee && (
          <span className="text-xs font-semibold text-green-600 ml-auto">
            Rs. {Number(course.fee).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Event Card ───────────────────────────────────────────────────────────────
const EventCard = ({ event, query, onClick }) => {
  const typeColors = {
    seminar:    "bg-blue-50 text-blue-700",
    workshop:   "bg-amber-50 text-amber-700",
    conference: "bg-purple-50 text-purple-700",
    cultural:   "bg-pink-50 text-pink-700",
    sports:     "bg-green-50 text-green-700",
  };
  const typeClass = typeColors[event.eventType?.toLowerCase()] || "bg-slate-50 text-slate-600";

  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 shrink-0">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background: "#f0fdf4", color: "#15803d" }}>
          Event
        </span>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-green-600 transition-colors line-clamp-2 leading-snug">
          {highlight(event.title || event.name || "Event", query)}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {highlight(event.description || "No description available", query)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-auto pt-3 border-t border-gray-50">
        {event.eventType && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeClass}`}>
            {event.eventType}
          </span>
        )}
        {dateStr && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />{dateStr}
          </span>
        )}
        {event.location && (
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1 max-w-[120px]">{event.location}</span>
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ query, tab }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-700 mb-2">No {tab === "all" ? "results" : tab} found</h3>
    <p className="text-slate-400 text-sm max-w-sm">
      We couldn't find any {tab === "all" ? "results" : tab} matching{" "}
      <span className="font-semibold text-slate-600">"{query}"</span>.
      Try different keywords.
    </p>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, label, count, color }) => (
  <div className={`flex items-center gap-3 mb-5 pb-3 border-b-2 ${color}`}>
    <div className={`p-2 rounded-lg ${color.replace("border-", "bg-").replace("-500", "-50")}`}>
      <Icon className={`w-5 h-5 ${color.replace("border-", "text-")}`} />
    </div>
    <h2 className="text-lg font-bold text-slate-800">{label}</h2>
    <span className="ml-auto text-sm font-semibold text-slate-400">{count} found</span>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { fetchColleges, fetchAllEvents } = useUser();
  const { getAllCollegesCourses } = useCollege();

  const [localQuery, setLocalQuery]   = useState(query);
  const [activeTab, setActiveTab]     = useState("all");
  const [fetching, setFetching]       = useState(false);
  const [error, setError]             = useState(null);

  // Raw data from APIs
  const [allColleges, setAllColleges] = useState([]);
  const [allCourses, setAllCourses]   = useState([]);
  const [allEvents, setAllEvents]     = useState([]);

  // ── Fetch everything on mount ──
  useEffect(() => {
    const loadAll = async () => {
      setFetching(true);
      setError(null);
      try {
        const [collegesRes, coursesRes, eventsRes] = await Promise.allSettled([
          fetchColleges({ limit: 100 }),
          getAllCollegesCourses(),
          fetchAllEvents({ limit: 100 }),
        ]);

        // Colleges — fetchColleges sets context state; we need to read from API directly
        // We'll rely on the returned data from context after it sets state.
        // For courses and events we capture return values.
        if (coursesRes.status === "fulfilled" && coursesRes.value) {
          const courses = coursesRes.value?.courses || coursesRes.value || [];
          setAllCourses(Array.isArray(courses) ? courses : []);
          console.log("📚 Courses fetched:", courses);
        }
        if (eventsRes.status === "fulfilled" && eventsRes.value) {
          const events = eventsRes.value?.events || eventsRes.value?.data?.events || [];
          setAllEvents(Array.isArray(events) ? events : []);
          console.log("📅 Events fetched:", events);
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Also sync colleges from context after fetchColleges runs ──
  const { colleges } = useUser();
  useEffect(() => {
    if (colleges && colleges.length > 0) {
      setAllColleges(colleges);
      console.log("🏫 Colleges fetched:", colleges);
    }
  }, [colleges]);

  // ── Update URL when searching ──
  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  // ── Filtered results ──
  const filteredColleges = allColleges.filter((c) => matchesQuery(c, query));
  const filteredCourses  = allCourses.filter((c)  => matchesQuery(c, query));
  const filteredEvents   = allEvents.filter((e)   => matchesQuery(e, query));
  const totalCount       = filteredColleges.length + filteredCourses.length + filteredEvents.length;

  // Tab counts
  const tabCounts = {
    all:      totalCount,
    colleges: filteredColleges.length,
    courses:  filteredCourses.length,
    events:   filteredEvents.length,
  };

  // ── Sync query input with URL ──
  useEffect(() => { setLocalQuery(query); }, [query]);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">

      {/* ── Search Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 items-center">
            {/* Back / logo hint */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors shrink-0"
            >
              <GraduationCap className="w-6 h-6" />
              <span>SmartScholar</span>
            </button>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />

            {/* Search input */}
            <div className="relative flex-1 flex items-center bg-slate-50 border-2 border-slate-200 hover:border-blue-300 focus-within:border-blue-500 rounded-xl transition-all duration-200 overflow-hidden">
              <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search colleges, courses, events..."
                className="flex-1 pl-11 pr-4 py-3 bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => { setLocalQuery(""); setSearchParams({}); }}
                  className="pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Result summary ── */}
        <div className="mb-6">
          {query ? (
            <p className="text-slate-600 text-sm sm:text-base">
              {fetching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  Searching...
                </span>
              ) : (
                <>
                  <span className="font-bold text-slate-900">{totalCount}</span> results for{" "}
                  <span className="font-semibold text-blue-600">"{query}"</span>
                </>
              )}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">Enter a keyword above to start searching.</p>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 sm:gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {!fetching && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                  activeTab === id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {tabCounts[id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {fetching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-36 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
                  <div className="h-3 bg-slate-100 rounded-lg w-full" />
                  <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {!fetching && (
          <>
            {/* ALL tab */}
            {activeTab === "all" && (
              <div className="space-y-10">
                {/* Colleges section */}
                {filteredColleges.length > 0 && (
                  <section>
                    <SectionHeader icon={Building2} label="Colleges" count={filteredColleges.length} color="border-blue-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredColleges.slice(0, 3).map((c) => (
                        <CollegeCard
                          key={c._id}
                          college={c}
                          query={query}
                          onClick={() => navigate(`/colleges/${c._id}`)}
                        />
                      ))}
                    </div>
                    {filteredColleges.length > 3 && (
                      <button
                        onClick={() => setActiveTab("colleges")}
                        className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                      >
                        View all {filteredColleges.length} colleges <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </section>
                )}

                {/* Courses section */}
                {filteredCourses.length > 0 && (
                  <section>
                    <SectionHeader icon={BookOpen} label="Courses" count={filteredCourses.length} color="border-purple-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredCourses.slice(0, 3).map((c) => (
                        <CourseCard
                          key={c._id}
                          course={c}
                          query={query}
                          onClick={() => navigate(`/courses/${c._id}`)}
                        />
                      ))}
                    </div>
                    {filteredCourses.length > 3 && (
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="mt-4 flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                      >
                        View all {filteredCourses.length} courses <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </section>
                )}

                {/* Events section */}
                {filteredEvents.length > 0 && (
                  <section>
                    <SectionHeader icon={Calendar} label="Events" count={filteredEvents.length} color="border-green-500" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredEvents.slice(0, 3).map((e) => (
                        <EventCard
                          key={e._id}
                          event={e}
                          query={query}
                          onClick={() => navigate(`/events/${e._id}`)}
                        />
                      ))}
                    </div>
                    {filteredEvents.length > 3 && (
                      <button
                        onClick={() => setActiveTab("events")}
                        className="mt-4 flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:text-green-800 transition-colors"
                      >
                        View all {filteredEvents.length} events <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </section>
                )}

                {/* No results at all */}
                {totalCount === 0 && query && (
                  <div className="grid">
                    <EmptyState query={query} tab="all" />
                  </div>
                )}
              </div>
            )}

            {/* COLLEGES tab */}
            {activeTab === "colleges" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredColleges.length > 0
                  ? filteredColleges.map((c) => (
                      <CollegeCard key={c._id} college={c} query={query} onClick={() => navigate(`/colleges/${c._id}`)} />
                    ))
                  : <EmptyState query={query} tab="colleges" />}
              </div>
            )}

            {/* COURSES tab */}
            {activeTab === "courses" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.length > 0
                  ? filteredCourses.map((c) => (
                      <CourseCard key={c._id} course={c} query={query} onClick={() => navigate(`/courses/${c._id}`)} />
                    ))
                  : <EmptyState query={query} tab="courses" />}
              </div>
            )}

            {/* EVENTS tab */}
            {activeTab === "events" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.length > 0
                  ? filteredEvents.map((e) => (
                      <EventCard key={e._id} event={e} query={query} onClick={() => navigate(`/events/${e._id}`)} />
                    ))
                  : <EmptyState query={query} tab="events" />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;