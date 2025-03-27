import axios from 'axios';

// Axios instance with credentials 
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true
});

export default apiClient;
