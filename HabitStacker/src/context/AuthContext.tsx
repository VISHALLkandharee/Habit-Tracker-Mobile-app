import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
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
      const savedToken = await SecureStore.getItemAsync(CONFIG.TOKEN_KEY);

      // IF THERE IS NO TOKEN, DO NOT CALL THE BACKEND
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);
      // Only call this if we have a token
      const { user } = await authService.getMe();
      setUser(user);
    } catch (e) {
      // If the token is invalid/expired
      await SecureStore.deleteItemAsync(CONFIG.TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (data: any) => {
    const res = await authService.login(data);
    await SecureStore.setItemAsync(CONFIG.TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const signUp = async (data: any) => {
    const res = await authService.signup(data);
    await SecureStore.setItemAsync(CONFIG.TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(CONFIG.TOKEN_KEY);
    setToken(null);
    setUser(null);
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
