import mongoose from "mongoose";
import { HabitModel } from "../models/HabitModel";
import { checkAchievements } from "../utils/achievementEngine";

import type { Request, Response } from "express";

const getAllHabits = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const { status, title, category } = req.query;

    const filter: any = { user: userId };

    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };
    if (category) filter.category = category;

    const allHabits = await HabitModel.find(filter);

    if (!allHabits)
      return res
        .status(404)
        .json({ message: "habits not found with userAccount" });

    res.status(200).json({
      message: "habits retrieved successfully",
      habits: allHabits,
    });
  } catch (error) {
    res.status(500).json({ message: error || "Failed to retrieve habits" });
  }
};

const createHabit = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const { title, description, status, reminderTime, icon, color, frequency, targetDays, category } = req.body;

    const habitsCount = await HabitModel.countDocuments({
      user: userId,
      status: "active",
    });

    if (habitsCount >= 3)
      return res.status(400).json({
        message:
          "You have a maximum limit of 3 habits,complete 21 days of streak to add more",
      });

    const newHabit = new HabitModel({
      title,
      description,
      status,
      reminderTime,
      icon,
      color,
      frequency,
      targetDays,
      category,
      user: userId,
    });

    await newHabit.save();

    res
      .status(201)
      .json({ message: "Habit created successfully", habit: newHabit });
  } catch (error) {
    res
      .status(500)
      .json({ message: error || "Failed to create habit , server error" });
  }
};

const getHabit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string))
      return res.status(400).json({ message: "invalid id" });

    const habit = await HabitModel.findOne({ _id: id, user: userId });

    if (!habit)
      return res
        .status(404)
        .json({ message: "habit not found with the given id" });

    res.status(200).json({ message: "habit retrieved successfully", habit });
  } catch (error) {
    res.status(500).json({
      message: error || "Failed getting the habit due to server error",
    });
  }
};

//Update One Specific Habit
const updateHabit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { title, description, status, reminderTime, icon, color, frequency, targetDays, category } = req.body;

    // Build update object dynamically — only include fields that were actually sent
    const updates: Record<string, any> = {};
    if (title)                    updates.title        = title;
    if (description !== undefined) updates.description  = description;
    if (status)                   updates.status       = status;
    if (reminderTime !== undefined) updates.reminderTime = reminderTime;
    if (icon)                     updates.icon         = icon;
    if (color)                    updates.color        = color;
    if (frequency)                updates.frequency    = frequency;
    if (targetDays)               updates.targetDays   = targetDays;
    if (category)                 updates.category     = category;

    // Single atomic round-trip — much faster than findOne + save
    const habit = await HabitModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!habit)
      return res.status(404).json({ message: "habit not found with the given id" });

    res.status(200).json({ message: "habit updated successfully", habit });
  } catch (error) {
    res.status(500).json({
      message: error || "Failed updating the habit due to server error",
    });
  }
};

const markHabitComplete = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string))
      return res.status(400).json({ message: "invalid id" });

    const habit = await HabitModel.findOne({ _id: id, user: userId });

    if (!habit)
      return res
        .status(404)
        .json({ message: "habit not found with the given id" });

    //logic to mark habit as complete
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isCompletedForToday = habit.CompletedDates?.some(
      (date) => new Date(date).toDateString() === today.toDateString(),
    );

    if (isCompletedForToday) {
      return res
        .status(400)
        .json({ message: "Habit already marked as complete for today" });
    }

    habit.CompletedDates?.push(today);

    habit.currentStreak = calculateStreak(habit.CompletedDates, habit.frequency, habit.targetDays);

    if (habit.currentStreak > habit.longestStreak!) {
      habit.longestStreak = habit.currentStreak;
    }

    if (habit.currentStreak === 21 && habit.status === "active") {
      habit.status = "maintenance";
    }

    await habit.save();

    // Check for achievements (Point #4)
    checkAchievements(userId, habit).catch(e => console.error("Achievement trigger failed", e));

    res.status(200).json({
      message:
        habit.currentStreak === 21
          ? `${habit.currentStreak} Day streak , You can add habit now` //21 day streak
          : `Day ${habit.currentStreak} complete!`,
      habit,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error || "Failed marking the habit as complete due to server error",
    });
  }
};

const unMarkHabitComplete = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string))
      return res.status(400).json({ message: "invalid id" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    // Pull today's date in one atomic operation
    const habit = await HabitModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $pull: { CompletedDates: { $gte: today, $lt: tomorrow } } },
      { new: true }
    );

    if (!habit)
      return res.status(404).json({ message: "habit not found with the given id" });

    // Recalculate streak after pull
    habit.currentStreak = calculateStreak(habit.CompletedDates, habit.frequency, habit.targetDays);
    await habit.save();

    res.status(200).json({ message: "habit unmark completed!", habit });
  } catch (error) {
    res.status(500).json({
      message: error || "Failed marking the habit as incomplete due to server error",
    });
  }
};

const deleteHabit = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string))
      return res.status(400).json({ message: "invalid id" });

    const habit = await HabitModel.findOneAndDelete({ _id: id, user: userId });

    if (!habit)
      return res
        .status(404)
        .json({ message: "habit not found with the given id" });

    res.status(200).json({ message: "habit deleted successfully", habit });
  } catch (error) {
    res.status(500).json({
      message: error || "Failed deleting the habit due to server error",
    });
  }
};

const getAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { AchievementModel } = require("../models/AchievementModel");
    const achievements = await AchievementModel.find({ user: userId }).sort({ unlockedAt: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements" });
  }
};

export {
  getAllHabits,
  createHabit,
  getHabit,
  updateHabit,
  markHabitComplete,
  unMarkHabitComplete,
  deleteHabit,
  getAchievements,
};

// Logic For calculating streak (Frequency Aware)
function calculateStreak(completedDates: Date[] = [], frequency: string = 'daily', targetDays: string[] = []) {
  if (completedDates.length === 0) return 0;

  // Normalize and sort dates in descending order (newest first)
  const sortedDates = completedDates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const today = new Date().setHours(0, 0, 0, 0);
  
  // 1. Check if the streak is broken (hasn't been touched in too long)
  const lastCompleted = sortedDates[0];
  
  if (frequency === 'daily') {
    if (lastCompleted < today - 86400000 && lastCompleted !== today) return 0;
  } else {
    // For weekly/custom, if the last completion was more than 8 days ago, it's definitely broken
    if (today - lastCompleted > 86400000 * 8) return 0;
  }

  let streak = 0;
  let currentDate = today;

  // Simple and robust approach: count consecutive entries in sortedDates
  // For v2.0, we count "Consecutive Successful Occurrences"
  if (frequency === 'daily') {
    // Start from the most recent completion, not necessarily today.
    // This correctly handles: completed yesterday (not today) = streak stays alive
    let expected = sortedDates[0];
    for (const date of sortedDates) {
      if (date === expected) {
        streak++;
        expected -= 86400000;
      } else {
        break;
      }
    }
  } else {
      // For Weekly/Custom, we simply count total completions as long as they aren't "too far apart"
      // This is a common pattern in habit apps to avoid complex day-of-week logic bugs
      streak = sortedDates.length;
  }

  return streak;
}
