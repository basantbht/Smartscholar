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

      Object.entries(eventData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        // Skip file keys here (handle below)
        if (key === "banner" || key === "thumbnail") return;

        // If value is array/object => stringify
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Append files if they exist
      if (eventData.banner instanceof File) {
        formData.append("banner", eventData.banner);
      }
      if (eventData.thumbnail instanceof File) {
        formData.append("thumbnail", eventData.thumbnail);
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

    useEffect(() => {
      fetchEvents();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
      () => ({
        events,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
      }),
      [events, loading, createLoading, updateLoading, deleteLoading]
    );

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
  };

  export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEvents must be used within EventProvider");
    return context;
  };
