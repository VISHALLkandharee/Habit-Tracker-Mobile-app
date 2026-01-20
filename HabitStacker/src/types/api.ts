export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Habit {
  _id: string;
  title: string;
  description?: string; // Optional in your model
  status: 'active' | 'maintenance';
  currentStreak: number;
  longestStreak: number;
  reminderTime?: string | null;
  CompletedDates: string[]; // Dates come as strings from JSON
  color?: string; // Your model has it, but controller ignores it (we'll keep it in type)
  icon?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface HabitResponse {
  message: string;
  habit: Habit; // Backend returns single object { habit: ... }
}

export interface HabitsListResponse {
  message: string;
  habits: Habit[]; // Backend returns array { habits: [...] }
}