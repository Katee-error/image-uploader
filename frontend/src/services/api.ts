import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/images',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = await import('./authService');
        const response = await refreshToken(localStorage.getItem('token') || '');

        if (response?.success && response.token) {
          localStorage.setItem('token', response.token);
          originalRequest.headers.Authorization = `Bearer ${response.token}`;
          return axios(originalRequest);
        }

        localStorage.removeItem('token');
        window.location.href = '/auth';
      } catch {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

