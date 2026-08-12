import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { habitService } from '../services/habitService';
import { useAuth } from './AuthContext';
import { Habit } from '../types/api';
import { showAlert } from '../utils/ui';
import { storage } from '../utils/storage';
import { syncHabitReminders } from '../utils/notifications';
import {
  addToOfflineQueue,
  processOfflineQueue,
  setupNetworkListener,
} from '../utils/offlineSync';
import NetInfo from '@react-native-community/netinfo';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  isOnline: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (data: any) => Promise<void>;
  editHabit: (id: string, data: any) => Promise<void>;
  toggleComplete: (id: string, isCurrentlyCompleted: boolean) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);
const CACHE_KEY = 'cached_habits_list';

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuth();

  // Load cached habits initially for instant UI
  useEffect(() => {
    loadCachedHabits();
  }, []);

  // Fetch habits immediately when user logs in
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      storage.deleteItem(CACHE_KEY);
      syncHabitReminders([]);
    }
  }, [user]);

  // Set up network listener: when we come back online, sync the queue + refetch
  useEffect(() => {
    const unsubscribe = setupNetworkListener(async () => {
      setIsOnline(true);
      // Drain the offline queue silently
      try {
        await processOfflineQueue(habitService);
      } catch (e) {
        console.error('Failed to process offline queue', e);
      }
      // Refetch fresh data from server
      if (user) {
        fetchHabits();
      }
    });

    // Also check initial network state
    NetInfo.fetch().then(state => {
      setIsOnline(!!state.isConnected);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user]);

  const loadCachedHabits = async () => {
    try {
      const cached = await storage.getItem(CACHE_KEY);
      if (cached) {
        setHabits(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to load habit cache', e);
    }
  };

  const updateAndCacheHabits = async (newHabits: Habit[]) => {
    setHabits(newHabits);
    try {
      await storage.setItem(CACHE_KEY, JSON.stringify(newHabits));
    } catch (e) {
      console.error('Failed to cache habits', e);
    }
  };

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await habitService.getHabits();
      const fetchedHabits = res.habits || [];
      await updateAndCacheHabits(fetchedHabits);
      await syncHabitReminders(fetchedHabits);
    } catch (err) {
      console.error('Fetch Error:', err);
      // If we have cached habits, we don't alert, just keep the cache
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (data: any) => {
    // Check network connectivity
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      // Queue the action for later
      await addToOfflineQueue({ type: 'CREATE_HABIT', data });
      // Show a local optimistic placeholder so the UI isn't blank
      const placeholderHabit: Habit = {
        _id: `offline_${Date.now()}`,
        title: data.title,
        description: data.description || '',
        status: 'active',
        currentStreak: 0,
        longestStreak: 0,
        reminderTime: data.reminderTime || null,
        frequency: data.frequency || 'daily',
        targetDays: data.targetDays || [],
        category: data.category || 'General',
        CompletedDates: [],
        color: data.color,
        icon: data.icon,
      };
      const newHabits = [...habits, placeholderHabit];
      await updateAndCacheHabits(newHabits);
      showAlert(
        'Saved Offline',
        'No internet connection. Your habit will sync automatically when you go online.'
      );
      return;
    }

    try {
      const res = await habitService.createHabit(data);
      const newHabits = [...habits, res.habit];
      await updateAndCacheHabits(newHabits);
      await syncHabitReminders(newHabits);
    } catch (error) {
      throw error;
    }
  };

  const editHabit = async (id: string, data: any) => {
    try {
      const res = await habitService.updateHabit(id, data);
      const updatedHabits = habits.map(h => h._id === id ? res.habit : h);
      await updateAndCacheHabits(updatedHabits);
      await syncHabitReminders(updatedHabits);
    } catch (error) {
      throw error;
    }
  };

  const toggleComplete = async (id: string, isCurrentlyCompleted: boolean) => {
    if (syncingIds.has(id)) return; // Prevent duplicate requests

    setSyncingIds(prev => new Set(prev).add(id));

    // Optimistic update for "premium" feel
    const originalHabits = [...habits];
    const optimisticHabits = habits.map(h => {
      if (h._id === id) {
        const today = new Date().toISOString();
        const newDates = isCurrentlyCompleted
          ? h.CompletedDates.filter(d => new Date(d).toDateString() !== new Date().toDateString())
          : [...h.CompletedDates, today];
        return { ...h, CompletedDates: newDates };
      }
      return h;
    });

    setHabits(optimisticHabits);

    // Check network before calling API
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      // Queue it for later — the optimistic UI update stays
      await addToOfflineQueue({
        type: isCurrentlyCompleted ? 'UNMARK_COMPLETE' : 'MARK_COMPLETE',
        habitId: id,
      });
      // Persist the optimistic state to cache
      try {
        await storage.setItem(CACHE_KEY, JSON.stringify(optimisticHabits));
      } catch (e) { /* ignore */ }
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }

    try {
      const res = isCurrentlyCompleted
        ? await habitService.unmarkComplete(id)
        : await habitService.markComplete(id);

      // Use the original habits array as the base to avoid stale closures
      const updatedHabits = originalHabits.map(h => h._id === id ? res.habit : h);
      await updateAndCacheHabits(updatedHabits);
    } catch (error) {
      console.error('Toggle Error:', error);
      setHabits(originalHabits); // Rollback on error
      showAlert('Sync Failed', 'Could not update habit. Check your connection.');
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      const newHabits = habits.filter(h => h._id !== id);
      await updateAndCacheHabits(newHabits);
      await syncHabitReminders(newHabits);
    } catch (error) {
      console.error('Delete Error:', error);
      showAlert('Delete Failed', 'Could not remove habit.');
    }
  };

  return (
    <HabitContext.Provider value={{ habits, loading, isOnline, fetchHabits, addHabit, editHabit, toggleComplete, deleteHabit }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within HabitProvider');
  return context;
};