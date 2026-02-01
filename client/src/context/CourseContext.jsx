import { createContext, useContext, useState, useMemo } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================== COLLEGE COURSE MANAGEMENT ====================

  // Fetch all courses for the logged-in college
  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/courses");
      setCourses(res.data?.data?.courses || []);
      return res.data?.data?.courses;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new course
  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      const res = await api.post("/college/courses", courseData);
      toast.success("Course created successfully");
      await fetchMyCourses(); // Refresh the course list
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a single course by ID
  const getCourseById = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.get(`/college/courses/${courseId}`);
      setCurrentCourse(res.data?.data?.course);
      return res.data?.data?.course;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a course
  const updateCourse = async (courseId, courseData) => {
    setLoading(true);
    try {
      const res = await api.put(`/college/courses/${courseId}`, courseData);
      toast.success("Course updated successfully");
      await fetchMyCourses(); // Refresh the course list
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const res = await api.delete(`/college/courses/${courseId}`);
      toast.success("Course deleted successfully");
      await fetchMyCourses(); // Refresh the course list
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ==================== PUBLIC COURSE ACCESS (FOR STUDENTS) ====================

  // Fetch all courses for a specific college (public access)
  const getCoursesByCollege = async (collegeId) => {
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

  // ==================== UTILITY METHODS ====================

  // Clear current course
  const clearCurrentCourse = () => {
    setCurrentCourse(null);
  };

  // Clear all courses
  const clearCourses = () => {
    setCourses([]);
  };

  // Search/Filter courses
  const filterCourses = (searchTerm, degreeFilter = null, schoolFilter = null) => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (degreeFilter) {
      filtered = filtered.filter((course) => course.degree === degreeFilter);
    }

    if (schoolFilter) {
      filtered = filtered.filter((course) => course.school === schoolFilter);
    }

    return filtered;
  };

  // Get unique degrees from courses
  const getUniqueDegrees = () => {
    return [...new Set(courses.map((course) => course.degree).filter(Boolean))];
  };

  // Get unique schools from courses
  const getUniqueSchools = () => {
    return [...new Set(courses.map((course) => course.school).filter(Boolean))];
  };

  // Get total seats
  const getTotalSeats = () => {
    return courses.reduce((total, course) => total + (course.seats || 0), 0);
  };

  const value = useMemo(
    () => ({
      // State
      courses,
      currentCourse,
      loading,

      // College methods
      fetchMyCourses,
      createCourse,
      getCourseById,
      updateCourse,
      deleteCourse,

      // Public methods
      getCoursesByCollege,

      // Utility methods
      clearCurrentCourse,
      clearCourses,
      filterCourses,
      getUniqueDegrees,
      getUniqueSchools,
      getTotalSeats,
    }),
    [courses, currentCourse, loading]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};