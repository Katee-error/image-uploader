import { AuthResponse } from '@/types';
import { authApi } from '@/api';

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/login', { email, password });
  return response.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse | null> => {
  try {
    const response = await authApi.post<AuthResponse>('/refresh-token', { token });
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await authApi.post<{ valid: boolean }>('/validate-token', { token });
    return response.data.valid;
  } catch {
    return false;
  }
};
