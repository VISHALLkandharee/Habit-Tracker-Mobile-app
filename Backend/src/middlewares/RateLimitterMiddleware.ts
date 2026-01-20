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


export const generalLimitter = rateLimit({
  windowMs: 60 * 1000, //1 min
  max: 200,
    message: {
    success: false,
    error: "Too many request! try again later...",
  },
  standardHeaders: true,
  legacyHeaders: false,
});