import { Router } from "express";
import { getGlobalLeaderboard, getCommunityPulse } from "../controllers/CommunityControllers";
import { protectUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.use(protectUser);

router.get("/leaderboard", getGlobalLeaderboard);
router.get("/pulse", getCommunityPulse);

export default router;
