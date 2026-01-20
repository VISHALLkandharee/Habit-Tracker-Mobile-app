import { UserModel } from "../models/UserModel.js";

import type { Request, Response } from "express";

import { generateAccessAndRefreshToken } from "../utils/jwt.js";




//Admin Controller
const getAllUsers = async (req: Request, res: Response) => {

  try {
    
    const users = await UserModel.find().select("-password -refreshToken");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json({ message: "Users fetched successfully", users });

  } catch (error) {
    res.status(500).json({ message: error || "Failed Getting all users Server Error" });
  }

}




const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, avatar, adminId } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = adminId === process.env.ADMIN_ID ? 'admin' : 'user';

    const newUser = new UserModel({
      name,
      email,
      password,
      avatar,
      role
    });


    const { accessToken, refreshToken } = generateAccessAndRefreshToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: error || "Server Error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // further validation will be auto handled error validation middleware

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid email or password!" });

    const isPasswordValid = await user.comparePassword(password as string);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password!" });

    const { accessToken } = generateAccessAndRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return res.status(200).json({
      message: "Login successful!",
      user,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed , server error!" });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const user = await UserModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json({
      message: "User profile fetched successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user profile, server error!",
    });
  }
};

export { registerUser, loginUser, getUserProfile, getAllUsers};
