import apiClient from '../api/client';
import { AuthResponse, User } from '../types/api';

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  
  signup: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};