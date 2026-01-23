import { createContext, useContext, useState, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch college profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data?.data?.user);
      return res.data?.data?.user;
    } catch (error) {
      toast.error("Failed to fetch profile");
      throw error;
    }
  };

  // Create college profile
  const createProfile = async (data) => {
    setLoading(true);
    try {
      const config = data instanceof FormData 
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
        
      const res = await api.post("/college/profile", data, config);
      toast.success("Profile created successfully");
      setProfile(res.data?.data?.college);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create profile");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update college profile
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const config = data instanceof FormData 
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
        
      const res = await api.put("/college/profile", data, config);
      toast.success("Profile updated successfully");
      setProfile(res.data?.data?.college);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch verification status
  const fetchVerification = async () => {
    try {
      const res = await api.get("/college/verification");
      setVerification(res.data?.data);
      return res.data?.data;
    } catch (error) {
      toast.error("Failed to fetch verification status");
      throw error;
    }
  };

  // Submit verification documents
  const submitVerification = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post("/college/verification/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Verification documents submitted");
      await fetchVerification();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit documents");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/college/posts");
      setPosts(res.data?.data?.posts || []);
      return res.data?.data?.posts;
    } catch (error) {
      toast.error("Failed to fetch posts");
      throw error;
    }
  };

  // Create post
  const createPost = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/college/posts", data);
      toast.success("Post created successfully");
      await fetchPosts();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await api.get("/college/applications");
      setApplications(res.data?.data?.applications || []);
      return res.data?.data?.applications;
    } catch (error) {
      toast.error("Failed to fetch applications");
      throw error;
    }
  };

  // Review application
  const reviewApplication = async (applicationId, action, feedback) => {
    setLoading(true);
    try {
      const res = await api.put(`/college/applications/${applicationId}/review`, {
        action,
        collegeFeedback: feedback,
      });
      toast.success("Application reviewed successfully");
      await fetchApplications();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to review application");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get("/college/sessions");
      setSessions(res.data?.data?.sessions || []);
      return res.data?.data?.sessions;
    } catch (error) {
      toast.error("Failed to fetch sessions");
      throw error;
    }
  };

  // Update session
  const updateSession = async (sessionId, data) => {
    setLoading(true);
    try {
      const res = await api.put(`/college/sessions/${sessionId}`, data);
      toast.success("Session updated successfully");
      await fetchSessions();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      profile,
      verification,
      posts,
      applications,
      sessions,
      loading,
      fetchProfile,
      createProfile,
      updateProfile,
      fetchVerification,
      submitVerification,
      fetchPosts,
      createPost,
      fetchApplications,
      reviewApplication,
      fetchSessions,
      updateSession,
    }),
    [profile, verification, posts, applications, sessions, loading]
  );

  return <CollegeContext.Provider value={value}>{children}</CollegeContext.Provider>;
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error("useCollege must be used within CollegeProvider");
  }
  return context;
};