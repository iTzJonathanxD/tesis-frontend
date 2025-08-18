import axios, { AxiosError, AxiosResponse } from 'axios';
import { ApiError } from '@/types';

// Helper functions to safely access localStorage
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Log error for debugging (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: originalRequest?.url || 'unknown',
        method: originalRequest?.method || 'unknown',
        status: error.response?.status || 'unknown',
        statusText: error.response?.statusText || 'unknown',
        message: error.message || 'Unknown error',
        data: error.response?.data || null,
        headers: error.response?.headers || null,
      });
    }

    if (error.response?.status === 401 && originalRequest) {
      // Token expired, try to refresh
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
            }/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data;
          setAccessToken(access_token);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          removeTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
    }

    // Handle API errors
    const apiError: ApiError = {
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        'An error occurred',
      statusCode: error.response?.status || 500,
      error: (error.response?.data as any)?.error,
    };

    return Promise.reject(apiError);
  }
);

export default api;
export { api };
