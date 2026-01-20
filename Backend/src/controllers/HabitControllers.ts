import mongoose from "mongoose";
import { HabitModel } from "../models/HabitModel";

import type { Request, Response } from "express";

const getAllHabits = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const { status, title } = req.query;

    const filter: any = { user: userId };

    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };

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
    const { title, description, status, reminderTime } = req.body;

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
    const { title, description, status, reminderTime } = req.body;

    const habit = await HabitModel.findOne({ user: userId, _id: id });

    if (!habit)
      return res
        .status(404)
        .json({ message: "habit not found with the given id" });

    if (title) habit.title = title;
    if (description) habit.description = description;
    if (status) habit.status = status;
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;

    await habit.save();

    res.status(200).json({
      message: "habit updated successfully",
      habit,
    });
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
      (date) => date.toDateString() === today.toDateString(),
    );

    if (isCompletedForToday) {
      return res
        .status(400)
        .json({ message: "Habit already marked as complete for today" });
    }

    habit.CompletedDates?.push(today);

    habit.currentStreak = calculateStreak(habit.CompletedDates);

    if (habit.currentStreak > habit.longestStreak!) {
      habit.longestStreak = habit.currentStreak;
    }

    if (habit.currentStreak === 21 && habit.status === "active") {
      habit.status = "maintenance";
    }

    await habit.save();

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

    const habit = await HabitModel.findOne({ _id: id, user: userId });

    if (!habit)
      return res
        .status(404)
        .json({ message: "habit not found with the given id" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    habit.CompletedDates = habit.CompletedDates?.filter(
      (date) => date.toDateString() !== today.toDateString(),
    );

    habit.currentStreak = calculateStreak(habit.CompletedDates);

    await habit.save();

    res.status(200).json({ message: "habit unmark completed!", habit });
  } catch (error) {
    res.status(500).json({
      message:
        error || "Failed marking the habit as incomplete due to server error",
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

export {
  getAllHabits,
  createHabit,
  getHabit,
  updateHabit,
  markHabitComplete,
  unMarkHabitComplete,
  deleteHabit,
};

// Logcic For calculating straek
function calculateStreak(completedDates: Date[] = []) {
  if (completedDates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = completedDates
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000; // 24 hours in ms

  // Check if completed today or yesterday
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0; // Streak broken
  }

  let streak = 0;
  let expectedDate = today;

  for (const date of sortedDates) {
    if (date === expectedDate || date === expectedDate - 86400000) {
      streak++;
      expectedDate = date - 86400000;
    } else {
      break;
    }
  }

  return streak;
}
