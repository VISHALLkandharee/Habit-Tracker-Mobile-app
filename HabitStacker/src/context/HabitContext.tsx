import React, { createContext, useContext, useState, useEffect } from 'react';
import { habitService } from '../services/habitService';
import { useAuth } from './AuthContext';
import { Habit } from '../types/api';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (data: any) => Promise<void>;
  toggleComplete: (id: string, isCurrentlyCompleted: boolean) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch habits immediately when user logs in
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
    }
  }, [user]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await habitService.getHabits();
      // Backend returns { message: "...", habits: [...] }
      setHabits(res.habits || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (data: any) => {
    try {
      const res = await habitService.createHabit(data);
      // Backend returns { message: "...", habit: {...} }
      // We grab res.habit to update the list
      setHabits((prev) => [...prev, res.habit]);
    } catch (error) {
      // We re-throw this error so the Add Screen can show the "3 Habit Limit" alert
      throw error;
    }
  };

  const toggleComplete = async (id: string, isCurrentlyCompleted: boolean) => {
    try {
      // Optimistic update (optional, but makes app feel fast)
      // For now, we wait for server response to be safe
      const res = isCurrentlyCompleted 
        ? await habitService.unmarkComplete(id) 
        : await habitService.markComplete(id);
      
      // Update the specific habit in the list with the fresh data from backend (streak, etc)
      setHabits((prev) => prev.map(h => h._id === id ? res.habit : h));
    } catch (error) {
      console.error("Toggle Error:", error);
      alert("Failed to update habit status");
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits((prev) => prev.filter(h => h._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <HabitContext.Provider value={{ habits, loading, fetchHabits, addHabit, toggleComplete, deleteHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within HabitProvider');
  return context;
};