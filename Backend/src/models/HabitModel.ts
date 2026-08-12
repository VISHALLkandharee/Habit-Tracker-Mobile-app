import type { Habit } from "../types/HabitType.js";
import mongoose, { Schema, model } from "mongoose";

const habitSchema = new Schema<Habit>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "compromised"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    color: { type: String },
    reminderTime: {
      type: String,
      default: null,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    targetDays: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "General",
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    CompletedDates: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true },
);

export const HabitModel = model<Habit>("Habit", habitSchema);
