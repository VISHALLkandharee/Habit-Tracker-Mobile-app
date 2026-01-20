import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers
} from "../controllers/AuthControllers.js";

//middlewares
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../middlewares/ValidateUserMiddleware";
import { protectUser } from "../middlewares/AuthMiddleware";
import { authLimitter } from "../middlewares/RateLimitterMiddleware";
import { checkAdminRole } from "../middlewares/AdminMiddleware";

const router = Router();


//Admin Routes
router.get("/admin/users", protectUser, checkAdminRole, getAllUsers);



// user routes
router.post(
  "/signup",
  authLimitter,
  validateRequest(registerSchema),
  registerUser
);
router.post("/login", authLimitter, validateRequest(loginSchema), loginUser);
router.get("/me", protectUser, getUserProfile);

export default router;
