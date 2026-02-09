import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Base API URL
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

  // Configure axios defaults
  axios.defaults.withCredentials = true;

  // Fetch all colleges with filters
  const fetchColleges = async (filters = {}) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.verificationStatus) params.append('verificationStatus', filters.verificationStatus);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(
        `${API_URL}/student/colleges?${params.toString()}`
      );

      console.log(response)

      if (response.data.success) {
        setColleges(response.data.data.colleges);
        
        // Update pagination if provided
        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        } else {
          // If no pagination from backend, set basic pagination
          setPagination({
            page: filters.page || 1,
            limit: filters.limit || 12,
            total: response.data.data.count || response.data.data.colleges.length,
            totalPages: Math.ceil((response.data.data.count || response.data.data.colleges.length) / (filters.limit || 12))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
      setPagination({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch single college by ID
  const fetchCollegeById = async (collegeId) => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${API_URL}/student/colleges/${collegeId}`
      );
      console.log(response)

      if (response.data.success) {
        setSelectedCollege(response.data.data.college);
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching college:', error);
      setSelectedCollege(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear selected college
  const clearSelectedCollege = () => {
    setSelectedCollege(null);
  };

  // Apply to a post
  const applyToPost = async (postId, formData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/student/posts/${postId}/apply`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error applying to post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's applications
  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${API_URL}/student/applications`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ========== EVENT RELATED METHODS ==========

  // Fetch all my event applications (Student)
  const fetchMyEventApplications = async (filters = {}) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(
        `${API_URL}/events/my-applications?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching event applications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Apply for an event
  const applyForEvent = async (eventId, applicationData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_URL}/events/${eventId}/apply`,
        applicationData
      );

      return response.data;
    } catch (error) {
      console.error('Error applying for event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all events (public)
  const fetchAllEvents = async (filters = {}) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.collegeId) params.append('collegeId', filters.collegeId);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(
        `${API_URL}/events/all?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch single event by ID
  const fetchEventById = async (eventId) => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${API_URL}/events/${eventId}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    colleges,
    selectedCollege,
    pagination,
    
    // College methods
    fetchColleges,
    fetchCollegeById,
    clearSelectedCollege,
    
    // Student action methods
    applyToPost,
    fetchMyApplications,
    
    // Event methods
    fetchMyEventApplications,
    applyForEvent,
    fetchAllEvents,
    fetchEventById,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};