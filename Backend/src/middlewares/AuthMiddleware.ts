import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

function protectUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers && req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded)
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });

    console.log("Decoded Token in AuthMiddleware:", decoded);

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
}

export { protectUser };
