import { Router } from "express";
const router = Router();

//controllers
import {
  getAllHabits,
  createHabit,
  getHabit,
  deleteHabit,
  markHabitComplete,
  unMarkHabitComplete,
  updateHabit,
  getAchievements,
} from "../controllers/HabitControllers";
//middlewares
import { protectUser } from "../middlewares/AuthMiddleware";
import {
  validateCreateHabit,
  validateUpdateHabit,
} from "../middlewares/ValidateHabitMiddleware";
import { habitLimitter } from "../middlewares/RateLimitterMiddleware";

// protect all users to play or manipulate with habits
router.use(protectUser);
router.use(habitLimitter);

router.get("/", getAllHabits);
router.post("/", validateCreateHabit, createHabit);
router.get("/achievements", getAchievements);
router.get("/:id", getHabit);
router.put("/:id", validateUpdateHabit, updateHabit);
router.patch("/:id/complete", markHabitComplete);
router.patch("/:id/incomplete", unMarkHabitComplete);
router.delete("/:id", deleteHabit);

export default router;
