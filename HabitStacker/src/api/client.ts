import axios from 'axios';
import { storage } from '../utils/storage';
import { CONFIG } from '../constants/Config';

const apiClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  // Use CONFIG.TOKEN_KEY ('user_auth_token') instead of 'userToken'
  const token = await storage.getItem(CONFIG.TOKEN_KEY);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getItem(CONFIG.REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error("No refresh token");

        // Use base axios to avoid infinite loops
        const res = await axios.post(`${CONFIG.BASE_URL}/auth/refresh-token`, { refreshToken });
        
        const { token, refreshToken: newRefreshToken } = res.data;
        
        await storage.setItem(CONFIG.TOKEN_KEY, token);
        await storage.setItem(CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);

        // Update current request and retry using apiClient to preserve baseURL and configurations
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (err) {
        // If refresh fails, clear everything and the user will be bounced to login
        await storage.deleteItem(CONFIG.TOKEN_KEY);
        await storage.deleteItem(CONFIG.REFRESH_TOKEN_KEY);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;