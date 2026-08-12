import { AchievementModel } from "../models/AchievementModel";
import { Habit } from "../types/HabitType";

export const checkAchievements = async (userId: string, habit: Habit) => {
  try {
    const streak = habit.currentStreak || 0;
    
    // 1. Check for 7-day streak
    if (streak >= 7) {
      await unlockAchievement(userId, "7 Day Streak", "You've stayed consistent for a full week!", "streak", 7);
    }
    
    // 2. Check for 21-day habit formation
    if (streak >= 21) {
      await unlockAchievement(userId, "Habit Master", "21 days! This habit is now part of you.", "streak", 21);
    }

    // 3. Early Bird check (if habit completed before 8 AM)
    const now = new Date();
    if (now.getHours() < 8) {
      await unlockAchievement(userId, "Early Bird", "Completed a habit before 8 AM. The day is yours!", "early_bird", 1);
    }

  } catch (error) {
    console.error("Achievement Check Error:", error);
  }
};

const unlockAchievement = async (userId: string, title: string, description: string, type: string, requirement: number) => {
  const existing = await AchievementModel.findOne({ user: userId, title });
  if (!existing) {
    await AchievementModel.create({
      user: userId,
      title,
      description,
      type,
      requirement,
      icon: "trophy",
      unlockedAt: new Date()
    });
  }
};
