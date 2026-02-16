import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const SubscribeContext = createContext(null);

export const SubscribeProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  // Subscribe to general scholarship notifications
  const subscribe = async (email, universities = []) => {
    setSubscribeLoading(true);
    try {
      const res = await api.post("/subscriptions", {
        email,
        universities,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Successfully subscribed to scholarship notifications!");
        return res.data;
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      const errorMsg = error.response?.data?.message || "Failed to subscribe";
      toast.error(errorMsg);
      throw error;
    } finally {
      setSubscribeLoading(false);
    }
  };

  // Subscribe to specific scholarship reminders
  const subscribeToReminder = async (email, scholarshipId = null, daysBefore = 7) => {
    setReminderLoading(true);
    try {
      const payload = {
        email,
        days_before: daysBefore,
      };

      if (scholarshipId) {
        payload.scholarship_id = scholarshipId;
      }

      const res = await api.post("/reminders/subscribe", payload);

      if (res.data?.success) {
        toast.success(res.data.message || "Successfully subscribed to scholarship reminders!");
        return res.data;
      }
    } catch (error) {
      console.error("Error subscribing to reminder:", error);
      const errorMsg = error.response?.data?.message || "Failed to subscribe to reminders";
      toast.error(errorMsg);
      throw error;
    } finally {
      setReminderLoading(false);
    }
  };

  // Get all active subscriptions
  const getAllSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions");

      if (res.data?.success) {
        setSubscriptions(res.data.data || []);
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch subscriptions");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's reminders by email
  const getUserReminders = async (email) => {
    setLoading(true);
    try {
      const res = await api.get(`/reminders/user/${email}`);

      if (res.data?.success) {
        setReminders(res.data.data || []);
        return res.data.data;
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reminders");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe from general notifications
  const unsubscribe = async (email) => {
    setLoading(true);
    try {
      const res = await api.delete(`/subscriptions/${email}`);

      if (res.data?.success) {
        toast.success(res.data.message || "Unsubscribed successfully");
        return res.data;
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error(error.response?.data?.message || "Failed to unsubscribe");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove specific reminder
  const removeReminder = async (reminderId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/reminders/${reminderId}`);

      if (res.data?.success) {
        toast.success(res.data.message || "Reminder removed successfully");
        // Update local state
        setReminders((prev) => prev.filter((r) => r._id !== reminderId));
        return res.data;
      }
    } catch (error) {
      console.error("Error removing reminder:", error);
      toast.error(error.response?.data?.message || "Failed to remove reminder");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      subscriptions,
      reminders,
      loading,
      subscribeLoading,
      reminderLoading,
      subscribe,
      subscribeToReminder,
      getAllSubscriptions,
      getUserReminders,
      unsubscribe,
      removeReminder,
    }),
    [
      subscriptions,
      reminders,
      loading,
      subscribeLoading,
      reminderLoading,
    ]
  );

  return <SubscribeContext.Provider value={value}>{children}</SubscribeContext.Provider>;
};

export const useSubscribe = () => {
  const context = useContext(SubscribeContext);
  if (!context) throw new Error("useSubscribe must be used within SubscribeProvider");
  return context;
};