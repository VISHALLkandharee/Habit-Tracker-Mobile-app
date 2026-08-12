import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface customError extends Error {
  statusCode?: number;
}

const ErrorHandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

      //  Zod Validation Errors (400)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      errors: err.issues.map((e: any) => ({
        path: e.path,
        message: e.message
      })),
    });
  }


    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};


export {ErrorHandler}