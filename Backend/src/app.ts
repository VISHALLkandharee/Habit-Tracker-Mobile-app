import express from "express";
import cors from "cors";
import helmet from "helmet";

// User Routes
import AuthRoutes from "./routes/AuthRoutes";
import HabitRoutes from "./routes/HabitRoutes";

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

export default app;
