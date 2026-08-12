import { Router } from "express";
import { AchievementModel } from "../models/AchievementModel";
import { protectUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.use(protectUser);

router.get("/", async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const achievements = await AchievementModel.find({ user: userId });
    res.status(200).json({ achievements });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements" });
  }
});

export default router;
