import axios from 'axios';
import { User, AuthResponse } from '../types/user';

const API_URL = '/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const token = localStorage.getItem('token');
        if (!token) {
          return Promise.reject(error);
        }
        
        const refreshResponse = await refreshToken(token);
        
        if (refreshResponse && refreshResponse.success && refreshResponse.token) {
          // Update the token in localStorage
          localStorage.setItem('token', refreshResponse.token);
          
          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.token}`;
          
          // Retry the original request
          return axios(originalRequest);
        } else {
          // Token refresh failed, clear token and reject
          localStorage.removeItem('token');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Token refresh failed, clear token and reject
        localStorage.removeItem('token');
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Registration failed. Please try again later.');
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed. Please try again later.');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get user data');
    }
    throw new Error('Failed to get user data. Please try again later.');
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await api.post<{ valid: boolean }>('/validate-token', { token });
    return response.data.valid;
  } catch (error) {
    return false;
  }
};

export const refreshToken = async (token: string): Promise<AuthResponse | null> => {
  try {
    const response = await api.post<AuthResponse>('/refresh-token', { token });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Token refresh failed:', error.response.data);
    } else {
      console.error('Token refresh failed:', error);
    }
    return null;
  }
};
