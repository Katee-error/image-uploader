import { refreshToken } from "@/services/auth-service";
import axios, { AxiosInstance } from "axios";

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const token = localStorage.getItem("token") || "";
          const response = await refreshToken(token);

          if (response?.success && response.token) {
            localStorage.setItem("token", response.token);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            return instance(originalRequest);
          }

          localStorage.removeItem("token");
          window.location.href = "/auth";
        } catch {
          localStorage.removeItem("token");
          window.location.href = "/auth";
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
