import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Schema for creating a habit
const createHabitSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(500, { message: "Description must be at most 500 characters" }),
  status: z.enum(["active", "compromised"], {
    message: "Status must be either 'active' or 'compromised'",
  }),
  reminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Reminder time must be in HH:mm format (24-hour)",
    }),
});

// Schema for updating a habit (all fields optional)
const updateHabitSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be at most 100 characters" })
    .optional(),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(500, { message: "Description must be at most 500 characters" })
    .optional(),
  status: z
    .enum(["active", "compromised"], {
      message: "Status must be either 'active' or 'compromised'",
    })
    .optional(),
  reminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Reminder time must be in HH:mm format (24-hour)",
    })
    .optional(),
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