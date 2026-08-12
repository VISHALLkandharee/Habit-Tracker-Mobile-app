import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// User Routes
import AuthRoutes from "./routes/AuthRoutes";
import HabitRoutes from "./routes/HabitRoutes";
import AnalyticsRoutes from "./routes/AnalyticsRoutes";
import CommunityRoutes from "./routes/CommunityRoutes";
import AchievementRoutes from "./routes/AchievementRoutes";

const app = express();

// Apply security + performance middleware
app.use(helmet());
app.use(compression()); // gzip all responses (reduces payload 60-80%)
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
