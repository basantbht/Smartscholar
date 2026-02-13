import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventContext";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  Building2,
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const { allEvents, loading, getAllCollegesEvents } = useEvents();

  const [displayEvents, setDisplayEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    getAllCollegesEvents();
  }, []);

  useEffect(() => {
    if (allEvents && allEvents.length > 0) {
      extractFilterOptions(allEvents);
      applyFilters();
    }
  }, [allEvents, searchQuery, selectedEventType, selectedStatus]);

  const extractFilterOptions = (eventsData) => {
    const uniqueEventTypes = [
      ...new Set(eventsData.map((event) => event.eventType).filter(Boolean)),
    ];
    setEventTypes(uniqueEventTypes);
  };

  const applyFilters = () => {
    let filtered = [...allEvents];

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedEventType) {
      filtered = filtered.filter((event) => event.eventType === selectedEventType);
    }

    if (selectedStatus) {
      filtered = filtered.filter((event) => {
        const registrationDeadline = new Date(event.registrationDeadline);
        if (selectedStatus === "open") return isFuture(registrationDeadline);
        if (selectedStatus === "closed") return isPast(registrationDeadline);
        return true;
      });
    }

    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setDisplayEvents(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedEventType("");
    setSelectedStatus("");
  };

  const hasActiveFilters = searchQuery || selectedEventType || selectedStatus;

  const getEventStatus = (event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = new Date(event.registrationDeadline);
    const now = new Date();

    if (now >= startDate && now <= endDate)
      return { label: "Ongoing", color: "bg-green-100 text-green-700" };
    if (isFuture(startDate) && isFuture(registrationDeadline))
      return { label: "Open", color: "bg-blue-100 text-blue-700" };
    if (isFuture(startDate) && isPast(registrationDeadline))
      return { label: "Closed", color: "bg-orange-100 text-orange-700" };
    if (isPast(endDate))
      return { label: "Completed", color: "bg-gray-100 text-gray-700" };
    return { label: "Upcoming", color: "bg-indigo-100 text-indigo-700" };
  };

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isOpen && <div className="space-y-2">{children}</div>}
      </div>
    );
  };

  const EventCard = ({ event }) => {
    const status = getEventStatus(event);
    const isFreeEvent = !event.registrationFee || event.registrationFee === 0;
    const registrationOpen = isFuture(new Date(event.registrationDeadline));
    const collegeName =
      event.createdByCollege?.collegeProfile?.collegeName ||
      event.createdByCollege?.name ||
      "Unknown College";

    // ── Same pattern as CourseCard: navigate to the college that created this event
    const handleClick = () => {
      const collegeId = event.createdByCollege?._id;
      if (collegeId) {
        navigate(`/colleges/${collegeId}`);
      }
    };

    return (
      <div
        onClick={handleClick}
        className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg"
      >
        {/* Event Image */}
        <div className="relative h-40 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 overflow-hidden">
          {event.banner || event.thumbnail ? (
            <img
              src={event.banner || event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-sm ${status.color} border border-white/20`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Event Header */}
        <div className="p-5 border-b-2 border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="line-clamp-1">{collegeName}</span>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 capitalize">
              {event.eventType}
            </span>
            {isFreeEvent ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                FREE
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
                ₹{event.registrationFee}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-gray-700">
                {format(new Date(event.startDate), "MMM dd, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-gray-700 truncate">
                {event.isOnline ? "Online Event" : event.venue}
              </span>
            </div>

            {event.maxParticipants && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-gray-700">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                </div>
                {event.currentParticipants >= event.maxParticipants && (
                  <span className="text-xs font-semibold text-red-600">FULL</span>
                )}
              </div>
            )}

            {registrationOpen && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="text-gray-700">Registration open</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <FilterSection title="Event Type">
                <div className="space-y-2">
                  {eventTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="eventType"
                        checked={selectedEventType === type}
                        onChange={() =>
                          setSelectedEventType(selectedEventType === type ? "" : type)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {type}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {allEvents.filter((e) => e.eventType === type).length}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Registration Status">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === "open"}
                      onChange={() =>
                        setSelectedStatus(selectedStatus === "open" ? "" : "open")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Open</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {allEvents.filter((e) => isFuture(new Date(e.registrationDeadline))).length}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === "closed"}
                      onChange={() =>
                        setSelectedStatus(selectedStatus === "closed" ? "" : "closed")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Closed</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {allEvents.filter((e) => isPast(new Date(e.registrationDeadline))).length}
                    </span>
                  </label>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Events in Nepal</h1>
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">{displayEvents.length}</span> of{" "}
                <span className="font-medium text-gray-900">{allEvents.length}</span> events
              </p>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEventType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                    {selectedEventType}
                    <button
                      onClick={() => setSelectedEventType("")}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedStatus && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm capitalize">
                    {selectedStatus} Registration
                    <button
                      onClick={() => setSelectedStatus("")}
                      className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {displayEvents.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more results"
                    : "No events are available at the moment"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Events;