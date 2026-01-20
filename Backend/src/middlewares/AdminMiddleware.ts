import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";

const checkAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as any).user.userId;

    // Assuming you have a UserModel to fetch user details
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error || "Failed Server Error" });
  }
};

export { checkAdminRole };
