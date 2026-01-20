import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';

export const validateRequest = (schema:ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
  };
};

// Validation schemas
export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email("Enter a valid email!"),
  password: z.string().min(6),
  adminId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email({message:"enter a valid email!"}),
  password: z.string().min(1),
});