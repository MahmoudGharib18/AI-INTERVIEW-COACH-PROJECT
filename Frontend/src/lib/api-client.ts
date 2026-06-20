import axios, { AxiosInstance, AxiosError } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    const errorPayload = {
      message: error.response?.data?.message || 'CRITICAL_ERR: Telemetry bridge broken.',
      status: error.response?.status || 500,
      success: false
    };
    return Promise.reject(errorPayload);
  }
);