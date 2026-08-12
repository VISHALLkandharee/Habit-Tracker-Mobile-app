import mongoose, { Schema, Document } from "mongoose";

export interface Achievement extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'total' | 'early_bird' | 'stacker';
  requirement: number; // e.g., 7 for a 7-day streak
  unlockedAt?: Date;
}

const achievementSchema = new Schema<Achievement>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  type: { type: String, enum: ['streak', 'total', 'early_bird', 'stacker'], required: true },
  requirement: { type: Number, required: true },
  unlockedAt: { type: Date, default: null }
}, { timestamps: true });

// Add unique index to prevent duplicate achievements per user/badge
achievementSchema.index({ user: 1, title: 1 }, { unique: true });

export const AchievementModel = mongoose.model<Achievement>("Achievement", achievementSchema);
