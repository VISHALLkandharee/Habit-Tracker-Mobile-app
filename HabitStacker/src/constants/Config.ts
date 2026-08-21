import Constants from 'expo-constants';

// Local development Metro host IP extraction
const hostUri = Constants.expoConfig?.hostUri || (Constants as any).developerLauncher?.manifest?.debuggerHost;
const hostIp = hostUri ? hostUri.split(':')[0] : '192.168.10.18';

// Production API URL for deployed backend (Railway / Cloud)
// Production API URL for deployed backend (Railway)
export const PROD_API_URL = 'https://habit-tracker-mobile-app-production.up.railway.app/api';

export const CONFIG = {
  // In development mode (__DEV__), connects to your local machine.
  // In production builds (EAS preview/production), connects to your live HTTPS server.
  BASE_URL: __DEV__ ? `http://${hostIp}:8000/api` : PROD_API_URL,
  TOKEN_KEY: 'user_auth_token',
  REFRESH_TOKEN_KEY: 'user_refresh_token',
};

export const COLORS = {
  primary: '#6366f1', // Indigo
  primaryLight: '#818cf8',
  secondary: '#f59e0b', // Amber
  accent: '#10b981', // Emerald
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  gray: '#94a3b8',
  border: '#e2e8f0',
  error: '#ef4444',
  success: '#10b981',
  white: '#ffffff',
  glass: 'rgba(255, 255, 255, 0.7)',
  glassDark: 'rgba(15, 23, 42, 0.8)',
};

export const GRADIENTS = {
  primary: ['#6366f1', '#4f46e5'] as const,
  success: ['#10b981', '#059669'] as const,
  error: ['#ef4444', '#dc2626'] as const,
  surface: ['#ffffff', '#f8fafc'] as const,
};

export const SHADOWS = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  md: { shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
};