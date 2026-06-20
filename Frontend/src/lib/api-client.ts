import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to scrub operational data structure out of Axios shells
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = {
      message: error.response?.data?.message || 'CRITICAL: Telemetry link down.',
      status: error.response?.status || 500,
    };
    return Promise.reject(errorPayload);
  }
);