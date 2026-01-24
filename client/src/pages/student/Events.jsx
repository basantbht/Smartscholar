import React, { useState, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter,
  Tag,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Award,
  Mail,
  Phone,
  Globe,
  Sparkles,
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format, isPast, isFuture, isToday, differenceInDays } from 'date-fns';

const Events = () => {
  const { events, loading } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  // Event types for filtering
  const eventTypes = [
    'all',
    'hackathon',
    'workshop',
    'seminar',
    'competition',
    'cultural',
    'sports',
    'technical',
    'webinar',
    'conference'
  ];

  useEffect(() => {
    if (events && events.length > 0) {
      filterEvents();
    }
  }, [events, searchTerm, selectedEventType, selectedStatus]);

  const filterEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Event type filter
    if (selectedEventType !== 'all') {
      filtered = filtered.filter(event =>
        event.eventType?.toLowerCase() === selectedEventType.toLowerCase()
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => {
        if (selectedStatus === 'published') return event.status === 'published';
        if (selectedStatus === 'draft') return event.status === 'draft';
        
        const registrationDeadline = new Date(event.registrationDeadline);
        if (selectedStatus === 'open') return isFuture(registrationDeadline);
        if (selectedStatus === 'closed') return isPast(registrationDeadline);
        
        return true;
      });
    }

    // Sort by start date (upcoming first)
    filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const getEventStatus = (event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const registrationDeadline = new Date(event.registrationDeadline);
    const now = new Date();
    
    if (now >= startDate && now <= endDate) {
      return { label: 'Ongoing', color: 'bg-green-100 text-green-800', icon: TrendingUp };
    }
    if (isFuture(startDate) && isFuture(registrationDeadline)) {
      return { label: 'Open for Registration', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
    }
    if (isFuture(startDate) && isPast(registrationDeadline)) {
      return { label: 'Registration Closed', color: 'bg-orange-100 text-orange-800', icon: XCircle };
    }
    if (isPast(endDate)) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    }
    return { label: 'Upcoming', color: 'bg-indigo-100 text-indigo-800', icon: Calendar };
  };

  const getDaysUntil = (date) => {
    const days = differenceInDays(new Date(date), new Date());
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 0) return `${days} days`;
    return 'Past';
  };

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEventType('all');
    setSelectedStatus('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-red-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">College Events</h1>
          </div>
          <p className="text-xl text-indigo-100 max-w-2xl">
            Discover exciting events, hackathons, workshops, and competitions happening at colleges
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold">{filteredEvents.length}</span>
              <span className="ml-2 text-indigo-100">Events</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold">
                {filteredEvents.filter(e => isFuture(new Date(e.registrationDeadline))).length}
              </span>
              <span className="ml-2 text-indigo-100">Open</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by title, venue, or organizer..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open Registration</option>
              <option value="closed">Closed Registration</option>
              <option value="published">Published</option>
            </select>

            {(searchTerm || selectedEventType !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Event Type Pills */}
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Event Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedEventType === type
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {filteredEvents.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
              {searchTerm && <span> matching "{searchTerm}"</span>}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {currentEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            {(searchTerm || selectedEventType !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentEvents.map((event) => {
                const status = getEventStatus(event);
                const StatusIcon = status.icon;
                const isFreeEvent = !event.registrationFee || event.registrationFee === 0;
                const hasSeatsLeft = event.currentParticipants < event.maxParticipants;
                const registrationOpen = isFuture(new Date(event.registrationDeadline));

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Event Banner */}
                    <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-blue-500 to-red-500 overflow-hidden">
                      {event.banner ? (
                        <img
                          src={event.banner}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color} backdrop-blur-sm`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                          {event.eventType}
                        </div>
                      </div>

                      {/* Registration Fee Badge */}
                      {isFreeEvent ? (
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                            FREE
                          </div>
                        </div>
                      ) : (
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{event.registrationFee}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2.5 mb-4">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {format(new Date(event.startDate), 'MMM dd, yyyy')}
                            {event.endDate && new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && 
                              ` - ${format(new Date(event.endDate), 'MMM dd, yyyy')}`
                            }
                          </span>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span className="text-gray-700">
                            {format(new Date(event.startDate), 'hh:mm a')}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span className="text-gray-700 truncate">
                            {event.isOnline ? 'Online Event' : event.venue}
                          </span>
                        </div>

                        {/* Participants */}
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span className="text-gray-700">
                            {event.currentParticipants}/{event.maxParticipants} participants
                          </span>
                          {!hasSeatsLeft && (
                            <span className="ml-auto text-xs font-semibold text-red-600">
                              FULL
                            </span>
                          )}
                        </div>

                        {/* Registration Deadline */}
                        {registrationOpen && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                            <span className="text-gray-700">
                              Registration closes in{' '}
                              <span className="font-semibold text-orange-600">
                                {getDaysUntil(event.registrationDeadline)}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Prizes */}
                      {event.prizes && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-900 mb-1">Prizes</p>
                              <p className="text-xs text-yellow-800 line-clamp-2">{event.prizes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {event.registrationLink && registrationOpen && hasSeatsLeft && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center text-sm flex items-center justify-center gap-2 group"
                          >
                            Register Now
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                        {event.website && (
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${event.registrationLink && registrationOpen && hasSeatsLeft ? 'px-4' : 'flex-1'} py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-center text-sm flex items-center justify-center gap-2`}
                          >
                            <Globe className="w-4 h-4" />
                            {event.registrationLink && registrationOpen && hasSeatsLeft ? '' : 'Details'}
                          </a>
                        )}
                      </div>

                      {/* Organizer Info */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Organized by</p>
                        <p className="text-sm font-semibold text-gray-900">{event.organizer}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {event.organizerEmail && (
                            <a
                              href={`mailto:${event.organizerEmail}`}
                              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              Email
                            </a>
                          )}
                          {event.organizerPhone && (
                            <a
                              href={`tel:${event.organizerPhone}`}
                              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;