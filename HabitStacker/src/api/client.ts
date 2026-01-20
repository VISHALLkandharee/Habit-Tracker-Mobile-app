import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../constants/Config'; // Import the CONFIG you just showed me

const apiClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  // Use CONFIG.TOKEN_KEY ('user_auth_token') instead of 'userToken'
  const token = await SecureStore.getItemAsync(CONFIG.TOKEN_KEY);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;