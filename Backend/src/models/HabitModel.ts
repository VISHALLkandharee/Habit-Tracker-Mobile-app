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
      enum: ["active", "maintenance"],
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
