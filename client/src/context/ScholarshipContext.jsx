import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const ScholarshipContext = createContext(null);

export const ScholarshipProvider = ({ children }) => {
  const [scholarships, setScholarships] = useState([]);
  const [currentScholarship, setCurrentScholarship] = useState(null);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // ✅ FETCH ALL SCHOLARSHIPS (for logged-in college)
  const fetchMyScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/scholarships");
      
      if (res.data.success) {
        setScholarships(res.data.data.scholarships || []);
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch scholarships");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH SCHOLARSHIP BY ID
  const fetchScholarshipById = async (scholarshipId) => {
    setLoading(true);
    try {
      const res = await api.get(`/college/scholarships/${scholarshipId}`);
      
      if (res.data.success) {
        setCurrentScholarship(res.data.data.scholarship);
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch scholarship");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE SCHOLARSHIP
  const createScholarship = async (scholarshipData) => {
    setCreateLoading(true);
    try {
      const res = await api.post("/college/scholarships", scholarshipData);
      
      if (res.data.success) {
        toast.success(res.data.message || "Scholarship created successfully");
        
        // Add to local state
        setScholarships((prev) => [res.data.data.scholarship, ...prev]);
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create scholarship");
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  // ✅ UPDATE SCHOLARSHIP
  const updateScholarship = async (scholarshipId, scholarshipData) => {
    setUpdateLoading(true);
    try {
      const res = await api.put(`/college/scholarships/${scholarshipId}`, scholarshipData);
      
      if (res.data.success) {
        toast.success(res.data.message || "Scholarship updated successfully");
        
        // Update local state
        setScholarships((prev) =>
          prev.map((s) => (s._id === scholarshipId ? res.data.data.scholarship : s))
        );
        
        if (currentScholarship?._id === scholarshipId) {
          setCurrentScholarship(res.data.data.scholarship);
        }
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update scholarship");
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  };

  // ✅ DELETE SCHOLARSHIP
  const deleteScholarship = async (scholarshipId) => {
    setDeleteLoading(true);
    try {
      const res = await api.delete(`/college/scholarships/${scholarshipId}`);
      
      if (res.data.success) {
        toast.success(res.data.message || "Scholarship deleted successfully");
        
        // Remove from local state
        setScholarships((prev) => prev.filter((s) => s._id !== scholarshipId));
        
        if (currentScholarship?._id === scholarshipId) {
          setCurrentScholarship(null);
        }
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete scholarship");
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ TOGGLE SCHOLARSHIP STATUS
  const toggleScholarshipStatus = async (scholarshipId) => {
    try {
      const res = await api.patch(`/college/scholarships/${scholarshipId}/toggle-status`);
      
      if (res.data.success) {
        toast.success(res.data.message || "Status updated successfully");
        
        // Update local state
        setScholarships((prev) =>
          prev.map((s) => (s._id === scholarshipId ? res.data.data.scholarship : s))
        );
        
        if (currentScholarship?._id === scholarshipId) {
          setCurrentScholarship(res.data.data.scholarship);
        }
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to toggle status");
      throw error;
    }
  };

  // ✅ FETCH SCHOLARSHIP STATS
  const fetchScholarshipStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.get("/college/scholarships/stats");
      
      if (res.data.success) {
        setStats(res.data.data.stats);
      }
      
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch stats");
      throw error;
    } finally {
      setStatsLoading(false);
    }
  };

  // ✅ FETCH PUBLIC SCHOLARSHIPS BY COLLEGE ID (for students)
  const fetchScholarshipsByCollegeId = async (collegeId) => {
    setLoading(true);
    try {
      const res = await api.get(`/college/colleges/${collegeId}/scholarships`);
      
      if (res.data.success) {
        return res.data.data.scholarships || [];
      }
      
      return [];
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch scholarships");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH ALL ACTIVE SCHOLARSHIPS (for students)
  const fetchAllActiveScholarships = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append("type", filters.type);
      if (filters.minAmount) params.append("minAmount", filters.minAmount);
      if (filters.maxAmount) params.append("maxAmount", filters.maxAmount);
      if (filters.search) params.append("search", filters.search);
      
      const res = await api.get(`/college/scholarships/public/all?${params.toString()}`);
      
      if (res.data.success) {
        return res.data.data.scholarships || [];
      }
      
      return [];
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch scholarships");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      scholarships,
      currentScholarship,
      stats,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      statsLoading,
      fetchMyScholarships,
      fetchScholarshipById,
      createScholarship,
      updateScholarship,
      deleteScholarship,
      toggleScholarshipStatus,
      fetchScholarshipStats,
      fetchScholarshipsByCollegeId,
      fetchAllActiveScholarships,
      setCurrentScholarship,
    }),
    [
      scholarships,
      currentScholarship,
      stats,
      loading,
      createLoading,
      updateLoading,
      deleteLoading,
      statsLoading,
    ]
  );

  return (
    <ScholarshipContext.Provider value={value}>
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarship = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error("useScholarship must be used within a ScholarshipProvider");
  }
  return context;
};