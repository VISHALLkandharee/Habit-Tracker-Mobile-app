import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Schema for creating a habit
const createHabitSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be at most 500 characters" })
    .optional()
    .or(z.literal('')),
  status: z.enum(["active", "maintenance", "compromised"], {
    message: "Status must be 'active', 'maintenance', or 'compromised'",
  }).default("active"),
  reminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Reminder time must be in HH:mm format (24-hour)",
    })
    .optional()
    .or(z.literal('')),
  icon: z.string().optional(),
  color: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
  targetDays: z.array(z.string()).optional().default([]),
  category: z.string().optional().default("General"),
});

// Schema for updating a habit (all fields optional, no defaults to prevent overwriting)
const updateHabitSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(["active", "maintenance", "compromised"]).optional(),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().or(z.literal('')),
  icon: z.string().optional(),
  color: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]).optional(),
  targetDays: z.array(z.string()).optional(),
  category: z.string().optional(),
});

// Validation middleware for creating habits
export const validateCreateHabit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createHabitSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
  }
};

// Validation middleware for updating habits
export const validateUpdateHabit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateHabitSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
  }
};