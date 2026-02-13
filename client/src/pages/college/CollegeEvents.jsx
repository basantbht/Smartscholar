import React, { useMemo, useState } from 'react';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  X,
  Search,
  Award,
  DollarSign,
  Link as LinkIcon,
  Globe,
  Tag,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const CollegeEvents = () => {
  const {
    events,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [formErrors, setFormErrors] = useState({});

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }

    if (!formData.registrationDeadline) {
      errors.registrationDeadline = 'Registration deadline is required';
    }

    if (
      formData.registrationDeadline &&
      formData.startDate &&
      new Date(formData.registrationDeadline) > new Date(formData.startDate)
    ) {
      errors.registrationDeadline = 'Registration deadline must be before start date';
    }

    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
    }

    if (!formData.organizer.trim()) {
      errors.organizer = 'Organizer name is required';
    }

    if (formData.organizerEmail && !/\S+@\S+\.\S+/.test(formData.organizerEmail)) {
      errors.organizerEmail = 'Invalid email format';
    }

    if (formData.isOnline && !formData.onlineLink.trim()) {
      errors.onlineLink = 'Online link is required for online events';
    }

    if (Number(formData.teamSizeMax) < Number(formData.teamSizeMin)) {
      errors.teamSizeMax = 'Max team size must be >= min team size';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Create a plain object with all the data
    const eventPayload = {
      // Basic Information
      title: formData.title,
      description: formData.description,

      // Event Type & Category
      eventType: formData.eventType,
      category: formData.category,

      // Event Dates
      startDate: formData.startDate,
      endDate: formData.endDate,
      registrationDeadline: formData.registrationDeadline,

      // Location
      venue: formData.venue,
      address: formData.address || null,
      isOnline: formData.isOnline,
      onlineLink: formData.onlineLink || null,

      // Organizer
      organizer: formData.organizer,
      organizerEmail: formData.organizerEmail || null,
      organizerPhone: formData.organizerPhone || null,

      // Registration
      registrationFee: Number(formData.registrationFee) || 0,
      maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : null,
      teamSize: {
        min: Number(formData.teamSizeMin) || 1,
        max: Number(formData.teamSizeMax) || 1,
      },

      // Eligibility
      eligibility: formData.eligibility || null,

      // Additional Info
      prizes: formData.prizes || null,
      tags: formData.tags,

      // Status
      status: formData.status,

      // Links
      website: formData.website || null,
      registrationLink: formData.registrationLink || null,
    };

    // Add banner and thumbnail files if they exist
    if (formData.bannerFile instanceof File) {
      eventPayload.banner = formData.bannerFile;
    }
    if (formData.thumbnailFile instanceof File) {
      eventPayload.thumbnail = formData.thumbnailFile;
    }

    try {
      if (editingEvent) {
        console.log("first")
        await updateEvent(editingEvent._id, eventPayload);
      } else {
        await createEvent(eventPayload);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  // Update your formData state to include file fields
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',

    // Event Type & Category
    eventType: 'hackathon',
    category: [],

    // Event Dates
    startDate: '',
    endDate: '',
    registrationDeadline: '',

    // Location
    venue: '',
    address: '',
    isOnline: false,
    onlineLink: '',

    // Organizer
    organizer: '',
    organizerEmail: '',
    organizerPhone: '',

    // Registration
    registrationFee: 0,
    maxParticipants: '',
    teamSizeMin: 1,
    teamSizeMax: 1,

    // Eligibility
    eligibility: '',

    // Files (NEW - store actual File objects)
    bannerFile: null,
    bannerPreview: '',
    thumbnailFile: null,
    thumbnailPreview: '',

    // Additional Info
    prizes: '',
    tags: [],

    // Status
    status: 'published',

    // Links
    website: '',
    registrationLink: '',
  });

  // Add these handler functions
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      bannerFile: file,
      bannerPreview: URL.createObjectURL(file)
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      thumbnailFile: file,
      thumbnailPreview: URL.createObjectURL(file)
    }));
  };


  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  // const handleEdit = (event) => {
  //   setEditingEvent(event);
  //   setFormData({
  //     title: event.title,
  //     description: event.description,
  //     eventType: event.eventType || 'hackathon',
  //     category: event.category || [],
  //     startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
  //     endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
  //     registrationDeadline: event.registrationDeadline
  //       ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
  //       : '',
  //     venue: event.venue || '',
  //     address: event.address || '',
  //     isOnline: event.isOnline || false,
  //     onlineLink: event.onlineLink || '',
  //     organizer: event.organizer || '',
  //     organizerEmail: event.organizerEmail || '',
  //     organizerPhone: event.organizerPhone || '',
  //     registrationFee: event.registrationFee || 0,
  //     maxParticipants: event.maxParticipants || '',
  //     teamSizeMin: event.teamSize?.min || 1,
  //     teamSizeMax: event.teamSize?.max || 1,
  //     eligibility: event.eligibility || '',
  //     banner: event.banner || '',
  //     thumbnail: event.thumbnail || '',
  //     prizes: event.prizes || '',
  //     tags: event.tags || [],
  //     status: event.status,
  //     website: event.website || '',
  //     registrationLink: event.registrationLink || '',
  //   });
  //   setShowModal(true);
  // };

  

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   setEditingEvent(null);
  //   setFormData({
  //     title: '',
  //     description: '',
  //     eventType: 'hackathon',
  //     category: [],
  //     startDate: '',
  //     endDate: '',
  //     registrationDeadline: '',
  //     venue: '',
  //     address: '',
  //     isOnline: false,
  //     onlineLink: '',
  //     organizer: '',
  //     organizerEmail: '',
  //     organizerPhone: '',
  //     registrationFee: 0,
  //     maxParticipants: '',
  //     teamSizeMin: 1,
  //     teamSizeMax: 1,
  //     eligibility: '',
  //     banner: '',
  //     thumbnail: '',
  //     prizes: '',
  //     tags: [],
  //     status: 'published',
  //     website: '',
  //     registrationLink: '',
  //   });
  //   setFormErrors({});
  // };

  // Replace your handleEdit function in CollegeEvents component

const handleEdit = (event) => {
  setEditingEvent(event);
  setFormData({
    title: event.title,
    description: event.description,
    eventType: event.eventType || 'hackathon',
    category: event.category || [],
    startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
    registrationDeadline: event.registrationDeadline
      ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
      : '',
    venue: event.venue || '',
    address: event.address || '',
    isOnline: event.isOnline || false,
    onlineLink: event.onlineLink || '',
    organizer: event.organizer || '',
    organizerEmail: event.organizerEmail || '',
    organizerPhone: event.organizerPhone || '',
    registrationFee: event.registrationFee || 0,
    maxParticipants: event.maxParticipants || '',
    teamSizeMin: event.teamSize?.min || 1,
    teamSizeMax: event.teamSize?.max || 1,
    eligibility: event.eligibility || '',
    
    // Don't set file fields when editing - they should be null
    bannerFile: null,
    bannerPreview: '',
    thumbnailFile: null,
    thumbnailPreview: '',
    
    prizes: event.prizes || '',
    tags: event.tags || [],
    status: event.status,
    website: event.website || '',
    registrationLink: event.registrationLink || '',
  });
  setShowModal(true);
};

// Also update handleCloseModal to clear file fields
const handleCloseModal = () => {
  setShowModal(false);
  setEditingEvent(null);
  setFormData({
    title: '',
    description: '',
    eventType: 'hackathon',
    category: [],
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venue: '',
    address: '',
    isOnline: false,
    onlineLink: '',
    organizer: '',
    organizerEmail: '',
    organizerPhone: '',
    registrationFee: 0,
    maxParticipants: '',
    teamSizeMin: 1,
    teamSizeMax: 1,
    eligibility: '',
    bannerFile: null,
    bannerPreview: '',
    thumbnailFile: null,
    thumbnailPreview: '',
    prizes: '',
    tags: [],
    status: 'published',
    website: '',
    registrationLink: '',
  });
  setFormErrors({});
  
  // Clean up preview URLs to prevent memory leaks
  if (formData.bannerPreview) {
    URL.revokeObjectURL(formData.bannerPreview);
  }
  if (formData.thumbnailPreview) {
    URL.revokeObjectURL(formData.thumbnailPreview);
  }
};

  const filteredEvents = useMemo(() => {
    return (events || []).filter((event) => {
      const title = String(event.title || '').toLowerCase();
      const desc = String(event.description || '').toLowerCase();
      const q = searchTerm.toLowerCase();

      const matchesSearch = title.includes(q) || desc.includes(q);
      const matchesStatusFilter = filterStatus === 'all' || event.status === filterStatus;
      const matchesTypeFilter = filterType === 'all' || event.eventType === filterType;

      return matchesSearch && matchesStatusFilter && matchesTypeFilter;
    });
  }, [events, searchTerm, filterStatus, filterType]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isSubmitting = createLoading || updateLoading;

  const statusBadgeClass = (status) => {
    if (status === 'published') return 'bg-green-50 text-green-700 ring-1 ring-green-200';
    if (status === 'cancelled') return 'bg-red-50 text-red-700 ring-1 ring-red-200';
    return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';
  };

  const typeBadgeClass = leading =>
    leading
      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
      : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200';

  const quickMetrics = useMemo(() => {
    const total = (events || []).length;
    const published = (events || []).filter((e) => e.status === 'published').length;
    const draft = (events || []).filter((e) => e.status === 'draft').length;
    const cancelled = (events || []).filter((e) => e.status === 'cancelled').length;
    return { total, published, draft, cancelled };
  }, [events]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Event Management</h1>
              <p className="text-gray-600">Create and manage college events</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{quickMetrics.total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">{quickMetrics.published}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{quickMetrics.draft}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{quickMetrics.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="hackathon">Hackathon</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="conference">Conference</option>
                <option value="competition">Competition</option>
                <option value="webinar">Webinar</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span>{' '}
                result{filteredEvents.length === 1 ? '' : 's'}
              </div>

              {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterType('all');
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* EVENTS LIST - ROW VIEW */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'No events found'
                : 'No events yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first event'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Create First Event
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sticky header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 sticky top-0 z-10">
              <div className="md:col-span-4">Event</div>
              <div className="md:col-span-3">Schedule</div>
              <div className="md:col-span-2">Location</div>
              <div className="md:col-span-2">Details</div>
              <div className="md:col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event, idx) => {
                const isOnline = Boolean(event.isOnline);
                const fee = Number(event.registrationFee || 0);
                const hasFee = fee > 0;

                return (
                  <div
                    key={event._id}
                    className={`px-5 py-4 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-blue-50/30`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Event */}
                      <div className="md:col-span-4">
                        <div className="flex gap-3 items-start">
                          {event.thumbnail ? (
                            <img
                              src={event.thumbnail}
                              alt={event.title}
                              className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                              <Calendar className="w-6 h-6 text-gray-400" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeBadgeClass(
                                  true
                                )}`}
                              >
                                {event.eventType || 'other'}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                                  event.status
                                )}`}
                              >
                                {event.status}
                              </span>
                              {isOnline && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                                  <Globe className="w-3.5 h-3.5" /> Online
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {event.description}
                            </p>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {event.tags.slice(0, 4).map((tagItem, tIdx) => (
                                  <span
                                    key={`${event._id}-tag-${tIdx}`}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                  >
                                    <Tag className="w-3 h-3" />
                                    {tagItem}
                                  </span>
                                ))}
                                {event.tags.length > 4 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    +{event.tags.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="md:col-span-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="truncate">
                              Ends: {event.endDate ? formatDate(event.endDate) : 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Reg. deadline:{' '}
                            <span className="font-medium text-gray-700">
                              {event.registrationDeadline ? formatDate(event.registrationDeadline) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="md:col-span-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="line-clamp-2">
                              {event.venue || (isOnline ? 'Online' : 'N/A')}
                            </span>
                          </div>

                          {isOnline && event.onlineLink && (
                            <a
                              href={event.onlineLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              <LinkIcon className="w-4 h-4" />
                              Join link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="md:col-span-2">
                        <div className="space-y-2 text-sm text-gray-700">
                          {hasFee ? (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>Fee: ${fee}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <DollarSign className="w-4 h-4 text-gray-300" />
                              <span>Free</span>
                            </div>
                          )}

                          {event.prizes ? (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span className="line-clamp-2">{event.prizes}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Award className="w-4 h-4 text-gray-300" />
                              <span>No prizes listed</span>
                            </div>
                          )}

                          {event.maxParticipants ? (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>
                                {event.currentParticipants || 0}/{event.maxParticipants}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Users className="w-4 h-4 text-gray-300" />
                              <span>Unlimited</span>
                            </div>
                          )}

                          {(event.website || event.registrationLink) && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {event.website && (
                                <a
                                  href={event.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                  <Globe className="w-4 h-4" />
                                  Website
                                </a>
                              )}
                              {event.registrationLink && (
                                <a
                                  href={event.registrationLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                  <LinkIcon className="w-4 h-4" />
                                  Register
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex md:justify-end gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="inline-flex items-center gap-2 px-3 py-2 md:px-2 md:py-2 text-blue-600 hover:bg-blue-100/60 rounded-lg transition disabled:opacity-50"
                          title="Edit event"
                          disabled={deleteLoading}
                        >
                          <Edit className="w-4 h-4" />
                          <span className="md:hidden text-sm font-medium">Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(event._id)}
                          className="inline-flex items-center gap-2 px-3 py-2 md:px-2 md:py-2 text-red-600 hover:bg-red-100/60 rounded-lg transition disabled:opacity-50"
                          title="Delete event"
                          disabled={deleteLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="md:hidden text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Mobile-only small footer */}
                    <div className="md:hidden mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(event.startDate)}
                      </span>
                      {event.venue && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {event.venue}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter event title"
                    maxLength={200}
                    disabled={isSubmitting}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Describe the event in detail"
                    disabled={isSubmitting}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="conference">Conference</option>
                      <option value="competition">Competition</option>
                      <option value="webinar">Webinar</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Event Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.registrationDeadline}
                      onChange={(e) =>
                        setFormData({ ...formData, registrationDeadline: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.registrationDeadline && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.registrationDeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Location Details
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={formData.isOnline}
                    onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="isOnline" className="text-sm font-medium text-gray-700">
                    This is an online event
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue *
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.venue ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="e.g., Main Auditorium"
                      disabled={isSubmitting}
                    />
                    {formErrors.venue && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.venue}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full address"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {formData.isOnline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Online Meeting Link {formData.isOnline && '*'}
                    </label>
                    <input
                      type="url"
                      value={formData.onlineLink}
                      onChange={(e) => setFormData({ ...formData, onlineLink: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.onlineLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="https://zoom.us/j/..."
                      disabled={isSubmitting}
                    />
                    {formErrors.onlineLink && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.onlineLink}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Organizer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Organizer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organizer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.organizer ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Organization/Club name"
                      disabled={isSubmitting}
                    />
                    {formErrors.organizer && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.organizer}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organizer Email
                    </label>
                    <input
                      type="email"
                      value={formData.organizerEmail}
                      onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.organizerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="contact@example.com"
                      disabled={isSubmitting}
                    />
                    {formErrors.organizerEmail && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.organizerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organizer Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.organizerPhone}
                      onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1234567890"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Registration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Registration & Participation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.registrationFee}
                      onChange={(e) =>
                        setFormData({ ...formData, registrationFee: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty for unlimited"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.teamSizeMin}
                      onChange={(e) => setFormData({ ...formData, teamSizeMin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.teamSizeMax}
                      onChange={(e) => setFormData({ ...formData, teamSizeMax: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.teamSizeMax ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={isSubmitting}
                    />
                    {formErrors.teamSizeMax && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.teamSizeMax}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility Criteria
                  </label>
                  <input
                    type="text"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Open to all students, Final year only"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Additional Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prizes & Rewards
                  </label>
                  <textarea
                    value={formData.prizes}
                    onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe prizes, certificates, or rewards"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter((t) => t),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AI, Machine Learning, Innovation"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.category.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value
                          .split(',')
                          .map((c) => c.trim())
                          .filter((c) => c),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Technology, Business, Arts"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Links & Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Links & Media</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      value={formData.registrationLink}
                      onChange={(e) =>
                        setFormData({ ...formData, registrationLink: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://forms.example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Image inputs */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const base64 = await fileToBase64(file);
                          setFormData({ ...formData, banner: base64 });
                        } catch (err) {
                          console.error('Failed to read banner file:', err);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const base64 = await fileToBase64(file);
                          setFormData({ ...formData, thumbnail: base64 });
                        } catch (err) {
                          console.error('Failed to read thumbnail file:', err);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div> */}

                {/* Image inputs - UPDATED VERSION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    {formData.bannerPreview && (
                      <div className="mt-2 relative">
                        <img
                          src={formData.bannerPreview}
                          alt="Banner preview"
                          className="h-24 w-full object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            bannerFile: null,
                            bannerPreview: ''
                          }))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Show existing banner if editing and no new file selected */}
                    {editingEvent && !formData.bannerPreview && editingEvent.banner && (
                      <div className="mt-2">
                        <img
                          src={editingEvent.banner}
                          alt="Current banner"
                          className="h-24 w-full object-cover rounded border opacity-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current banner (upload new to replace)</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    {formData.thumbnailPreview && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={formData.thumbnailPreview}
                          alt="Thumbnail preview"
                          className="h-24 w-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            thumbnailFile: null,
                            thumbnailPreview: ''
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Show existing thumbnail if editing and no new file selected */}
                    {editingEvent && !formData.thumbnailPreview && editingEvent.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={editingEvent.thumbnail}
                          alt="Current thumbnail"
                          className="h-24 w-24 object-cover rounded border opacity-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current thumbnail</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeEvents;
