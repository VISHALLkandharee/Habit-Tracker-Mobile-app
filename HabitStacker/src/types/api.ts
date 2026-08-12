export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Habit {
  _id: string;
  title: string;
  description?: string;
  status: 'active' | 'maintenance' | 'compromised';
  currentStreak: number;
  longestStreak: number;
  reminderTime?: string | null;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: string[];
  category: string;
  CompletedDates: string[];
  color?: string;
  icon?: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'total' | 'early_bird' | 'stacker';
  unlockedAt: string;
}

export interface Analytics {
  summary: {
    totalHabits: number;
    overallCompletionRate: number;
    totalCompletions: number;
  };
  categories: string[];
  habits: {
    id: string;
    title: string;
    streak: number;
    best: number;
    completionRate: number;
  }[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  refreshToken: string;
}

export interface HabitResponse {
  message: string;
  habit: Habit; // Backend returns single object { habit: ... }
}

export interface HabitsListResponse {
  message: string;
  habits: Habit[]; // Backend returns array { habits: [...] }
}