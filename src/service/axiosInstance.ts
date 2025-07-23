import axios from 'axios';
import { toast } from 'react-toastify';

// Axios instance with credentials
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // Timeout after 30 seconds
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log('Request Config:', config); // Log request details
    return config;
  },
  (error) => {
    //console.error('Request Error:', error); // Log request errors
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    //console.log('Response Data:', response.data); // Log response data
    return response;
  },
  (error) => {
    let errorMessage = `An unexpected error occured. Please try again later.`;
    //console.error('Response Error:', error); // Log response errors
    if (error.response) {
      //console.error('Response Body:', error.response.data.message);
      errorMessage = error.response.data?.message || 
                     error.response.data?.error ||
                     error.response.data?.detail ||
                     `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      //console.error('No response received:', error.request);
      errorMessage = `Network error. Please check your internet connection.`;
    } else {
      //console.error('Error Message:', error.message);
      errorMessage = error.message || errorMessage;
    }

    toast.error(errorMessage);

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
