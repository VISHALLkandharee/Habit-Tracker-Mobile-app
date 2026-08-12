import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";
import { authService } from "../services/authService";
import { User } from "../types/api";
import { CONFIG } from "../constants/Config";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const savedToken = await storage.getItem(CONFIG.TOKEN_KEY);
      const savedRefreshToken = await storage.getItem(CONFIG.REFRESH_TOKEN_KEY);

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);
      
      try {
        const { user } = await authService.getMe();
        setUser(user);
      } catch (e) {
        // If getMe fails (token expired), try refreshing
        if (savedRefreshToken) {
          const res = await authService.refresh(savedRefreshToken);
          await storage.setItem(CONFIG.TOKEN_KEY, res.token);
          await storage.setItem(CONFIG.REFRESH_TOKEN_KEY, res.refreshToken);
          setToken(res.token);
          setUser(res.user);
        } else {
          throw e; // No refresh token, logout
        }
      }
    } catch (e) {
      await storage.deleteItem(CONFIG.TOKEN_KEY);
      await storage.deleteItem(CONFIG.REFRESH_TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (data: any) => {
    const res = await authService.login(data);
    await storage.setItem(CONFIG.TOKEN_KEY, res.token);
    await storage.setItem(CONFIG.REFRESH_TOKEN_KEY, res.refreshToken);
    setToken(res.token);
    setUser(res.user);
  };

  const signUp = async (data: any) => {
    const res = await authService.signup(data);
    await storage.setItem(CONFIG.TOKEN_KEY, res.token);
    await storage.setItem(CONFIG.REFRESH_TOKEN_KEY, res.refreshToken);
    setToken(res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    try {
      // Call backend to invalidate token
      await authService.logout().catch(() => {});
      
      await storage.deleteItem(CONFIG.TOKEN_KEY);
      await storage.deleteItem(CONFIG.REFRESH_TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
