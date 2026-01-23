// contexts/AdminContext.jsx
import { createContext, useContext, useState, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all colleges
  const fetchColleges = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(params).toString();
      const res = await api.get(`/admin/colleges?${queryParams}`);
      setColleges(res.data?.data?.colleges || []);
      setPagination(res.data?.data?.pagination || null);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch colleges");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get college by ID
  const getCollegeById = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/colleges/${id}`);
      return res.data?.data?.college;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch college");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update college verification
  const updateVerification = async (id, status) => {
    setLoading(true);
    try {
      const res = await api.put(`/admin/colleges/${id}/verification`, {
        verificationStatus: status,
      });
      toast.success("Verification status updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update verification");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      colleges,
      pagination,
      loading,
      fetchColleges,
      getCollegeById,
      updateVerification,
    }),
    [colleges, pagination, loading]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};