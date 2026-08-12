import rateLimit from "express-rate-limit";

export const authLimitter = rateLimit({
  windowMs: 15 * 60 * 1000, //15mins
  max: 100,
  message: {
    success: false,
    error: "Too many request! try again in 15mins...",
  },

  standardHeaders: true,
  legacyHeaders: false,
});


export const habitLimitter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 300, // Reasonable limit for checking habits
  message: {
    success: false,
    error: "Slow down! You're updating habits too quickly.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});