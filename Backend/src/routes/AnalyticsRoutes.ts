import { Router } from "express";
import { getAdvancedAnalytics } from "../controllers/AnalyticsControllers";
import { protectUser } from "../middlewares/AuthMiddleware";

const router = Router();

router.use(protectUser);
router.get("/", getAdvancedAnalytics);

export default router;
