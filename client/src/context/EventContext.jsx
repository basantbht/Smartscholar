import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allEvents, setAllEvents] = useState([]); // For all colleges events
  const [applications, setApplications] = useState([]);
  const [applicationStats, setApplicationStats] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events");
      const eventList = res.data?.data?.events || [];
      setEvents(eventList);
      return eventList;
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(error.response?.data?.message || "Failed to fetch events");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buildFormData = (eventData) => {
    const formData = new FormData();

    // Store file references separately
    let bannerFile = null;
    let thumbnailFile = null;

    Object.entries(eventData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // Handle file objects separately
      if (key === "banner" && value instanceof File) {
        bannerFile = value;
        return;
      }
      if (key === "thumbnail" && value instanceof File) {
        thumbnailFile = value;
        return;
      }

      // Skip preview URLs
      if (key === "bannerPreview" || key === "thumbnailPreview") return;
      if (key === "bannerFile" || key === "thumbnailFile") return;

      // Handle arrays and objects
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "object" && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Append files at the end with correct field names
    if (bannerFile) {
      formData.append("banner", bannerFile);
    }
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    return formData;
  };

  const createEvent = async (eventData) => {
    setCreateLoading(true);
    try {
      const formData = buildFormData(eventData);

      const res = await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Event created successfully");
        await fetchEvents();
      }

      return res.data;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateEvent = async (eventId, eventData) => {
    setUpdateLoading(true);
    try {
      const formData = buildFormData(eventData);

      const res = await api.put(`/events/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
console.log(res)
      if (res.data?.success) {
        toast.success(res.data.message || "Event updated successfully");
        await fetchEvents();
      }

      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update event");
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/events/${eventId}`);

      if (res.data?.success) {
        toast.success(res.data.message || "Event deleted successfully");
        await fetchEvents();
      }

      return res.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  const getAllCollegesEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/all`);
      console.log(res)
      setAllEvents(res.data.data.events);
      // return res.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch events");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyForEvent = async (eventId, applicationData) => {
    try {
      const res = await api.post(`/events/${eventId}/apply`, applicationData);

      if (res.data?.success) {
        toast.success(res.data.message || "Application submitted successfully");
        return res.data;
      }
    } catch (error) {
      console.error("Error applying for event:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
      throw error;
    }
  };

  // Get all applications for a specific event
  const getAllEventApplications = async (eventId, filters = {}) => {
    setApplicationLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.paymentStatus) queryParams.append("paymentStatus", filters.paymentStatus);
      if (filters.isTeamRegistration === "true" || filters.isTeamRegistration === "false") {
        queryParams.append("isTeamRegistration", filters.isTeamRegistration);
      }

      if (filters.page) queryParams.append("page", filters.page);
      if (filters.limit) queryParams.append("limit", filters.limit);

      const url = `/events/${eventId}/applications${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await api.get(url);
      console.log(res)

      if (res.data?.success) {
        setApplications(res.data.data.applications);
        setApplicationStats(res.data.data.statistics);
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(error.response?.data?.message || "Failed to fetch applications");
      throw error;
    } finally {
      setApplicationLoading(false);
    }
  };

  // Get single application details
  const getApplicationById = async (applicationId) => {
    try {
      const res = await api.get(`/events/applications/${applicationId}`);

      if (res.data?.success) {
        return res.data.data.application;
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error(error.response?.data?.message || "Failed to fetch application details");
      throw error;
    }
  };

  // Approve application
  const approveApplication = async (applicationId) => {
    try {
      const res = await api.patch(`/events/applications/${applicationId}/approve`);

      if (res.data?.success) {
        toast.success(res.data.message || "Application approved successfully");
        return res.data.data.application;
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error(error.response?.data?.message || "Failed to approve application");
      throw error;
    }
  };

  // Reject application
  const rejectApplication = async (applicationId, rejectionReason) => {
    try {
      const res = await api.patch(`/events/applications/${applicationId}/reject`, {
        rejectionReason,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Application rejected successfully");
        return res.data.data.application;
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error(error.response?.data?.message || "Failed to reject application");
      throw error;
    }
  };

  // Update payment status
  const updatePaymentStatus = async (applicationId, paymentStatus, transactionId = null) => {
    try {
      const res = await api.patch(`/events/applications/${applicationId}/payment`, {
        paymentStatus,
        transactionId,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Payment status updated successfully");
        return res.data.data.application;
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(error.response?.data?.message || "Failed to update payment status");
      throw error;
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("token"); // adjust key if different
  if (!token) {
    setLoading(false);
    return;
  }
  fetchEvents();
}, []);


  const value = useMemo(
    () => ({
      events,
      allEvents,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      applications,
      applicationStats,
      applicationLoading,
      fetchEvents,
      createEvent,
      updateEvent,
      deleteEvent,
      getAllCollegesEvents,
      applyForEvent,
      getAllEventApplications,
      getApplicationById,
      approveApplication,
      rejectApplication,
      updatePaymentStatus,
    }),
    [
      events,
      allEvents,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      applications,
      applicationStats,
      applicationLoading,
    ]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};