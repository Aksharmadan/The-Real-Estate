import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: 'https://the-real-estate.onrender.com/api',
  timeout: 10000,
  
});


// Request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      toast.error('Cannot connect to server. Please make sure the backend server is running.');
      console.error('Backend server connection error:', error);
    } else if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
      if (error.response.status === 401) {
        // Don't show toast for 401, handle it silently
        localStorage.removeItem('token');
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        // Only show error for client errors that aren't 401
        if (error.response.status !== 401) {
          toast.error(message);
        }
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default API;
