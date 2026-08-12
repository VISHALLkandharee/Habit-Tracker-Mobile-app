import express from "express";
import cors from "cors";
import helmet from "helmet";

// User Routes
import AuthRoutes from "./routes/AuthRoutes";
import HabitRoutes from "./routes/HabitRoutes";
import AnalyticsRoutes from "./routes/AnalyticsRoutes";
import CommunityRoutes from "./routes/CommunityRoutes";
import AchievementRoutes from "./routes/AchievementRoutes";

const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("health is good!");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/habits", HabitRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/community", CommunityRoutes);
app.use("/api/achievements", AchievementRoutes);

export default app;
