import axios from 'axios';

// Axios instance with credentials
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // Timeout after 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request Config:', config); // Log request details
    return config;
  },
  (error) => {
    console.error('Request Error:', error); // Log request errors
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Data:', response.data); // Log response data
    return response;
  },
  (error) => {
    console.error('Response Error:', error); // Log response errors
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Body:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
