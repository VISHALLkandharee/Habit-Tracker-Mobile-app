import { Request, Response } from "express";
import { HabitModel } from "../models/HabitModel";

export const getAdvancedAnalytics = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const habits = await HabitModel.find({ user: userId });
    
    // 1. Calculate overall completion rate
    let totalOpportunities = 0;
    let totalCompletions = 0;
    
    habits.forEach(habit => {
      const createdDays = Math.ceil((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 1;
      
      let habitOpportunities = createdDays;
      if (habit.frequency === 'weekly') {
        habitOpportunities = Math.ceil(createdDays / 7);
      } else if (habit.frequency === 'custom' && habit.targetDays?.length) {
        habitOpportunities = Math.ceil((createdDays / 7) * habit.targetDays.length);
      }

      totalOpportunities += habitOpportunities;
      totalCompletions += habit.CompletedDates?.length || 0;
    });

    const overallRate = totalOpportunities > 0 ? (totalCompletions / totalOpportunities) * 100 : 0;

    // 2. Best performing day of the week (placeholder logic)
    // In a real app, you'd group CompletedDates by day of week
    
    // 3. Current Active Stacks (Categories)
    const categories = [...new Set(habits.map(h => h.category || "General"))];

    res.status(200).json({
      summary: {
        totalHabits: habits.length,
        overallCompletionRate: Math.round(overallRate),
        totalCompletions,
      },
      categories,
      habits: habits.map(h => ({
        id: h._id,
        title: h.title,
        streak: h.currentStreak,
        best: h.longestStreak,
        completionRate: h.CompletedDates!.length > 0 ? Math.round((h.CompletedDates!.length / 30) * 100) : 0 // Last 30 days placeholder
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
