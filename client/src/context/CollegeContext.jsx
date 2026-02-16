import { createContext, useContext, useState, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const CollegeContext = createContext(null);

export const CollegeProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // For all colleges courses
  const [loading, setLoading] = useState(false);

  // Fetch college profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data?.data?.user);
      return res.data?.data?.user;
    } catch (error) {
      toast.error("Failed to fetch profile");
     console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await api.get("/college/applications");
      setApplications(res.data?.data?.applications || []);
      return res.data?.data?.applications;
    } catch (error) {
      toast.error("Failed to fetch applications");
      console.log(error)
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
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // ==================== COLLEGE COURSE MANAGEMENT ====================

  // Fetch all courses for the logged-in college
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data?.data?.courses || []);
      return res.data?.data?.courses;
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Create course
  const createCourse = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/courses", data);
      toast.success("Course created successfully");
      await fetchCourses();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (courseId, data) => {
    setLoading(true);
    try {
      const res = await api.put(`/courses/${courseId}`, data);
      toast.success("Course updated successfully");
      await fetchCourses();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      await fetchCourses();
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Get course by ID
  const getCourseById = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      return res.data?.data?.course;
    } catch (error) {
      toast.error(error.response?.data?.message  || "Failed to fetch course");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // ==================== STUDENT/PUBLIC COURSE ACCESS ====================

  // Get all courses from all colleges (matches backend controller name)
  const getAllCollegesCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses/all");
      console.log(res)
      setAllCourses(res.data?.data?.courses || []);
      return res.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Get courses by specific college ID
  const getCoursesByCollegeId = async (collegeId) => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/colleges/${collegeId}/courses`);
      return res.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch college courses");
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const value = useMemo(
    () => ({
      profile,
      verification,
      applications,
      courses,
      allCourses,
      loading,
      fetchProfile,
      createProfile,
      updateProfile,
      fetchVerification,
      submitVerification,
      fetchApplications,
      reviewApplication,

      // Course methods
      fetchCourses,
      createCourse,
      updateCourse,
      deleteCourse,
      getCourseById,

      // Public course methods
      getAllCollegesCourses,
      getCoursesByCollegeId,
    }),
    [profile, verification, applications, courses, allCourses, loading]
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