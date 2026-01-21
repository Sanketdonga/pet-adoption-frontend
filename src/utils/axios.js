import axios from 'axios';

// Create a custom axios instance
const instance = axios.create({
  // Use environment variable if available, otherwise default to relative path (which uses Vite proxy in dev)
  // In production, set VITE_API_URL to your backend URL (e.g., https://my-api.onrender.com)
  baseURL: import.meta.env.VITE_API_URL || '', 
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
