import { Request, Response } from "express";
import { HabitModel } from "../models/HabitModel";
import { UserModel } from "../models/UserModel";

export const getGlobalLeaderboard = async (req: Request, res: Response) => {
  try {
    // 1. Fetch top users by their highest streak across any habit using aggregation
    const leaderboard = await HabitModel.aggregate([
      { $match: { longestStreak: { $gt: 0 } } },
      { $sort: { longestStreak: -1 } },
      {
        $group: {
          _id: "$user",
          bestStreak: { $first: "$longestStreak" },
          habitTitle: { $first: "$title" }
        }
      },
      { $sort: { bestStreak: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userName: "$userDetails.name",
          avatar: "$userDetails.avatar",
          habitTitle: 1,
          bestStreak: 1
        }
      }
    ]);

    res.status(200).json({
      message: "Global Leaderboard retrieved",
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch community stats" });
  }
};

export const getCommunityPulse = async (req: Request, res: Response) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const activeHabits = await HabitModel.countDocuments({ status: 'active' });
        
        res.status(200).json({
            totalUsers,
            activeHabits,
            message: "The community is growing! You are not alone."
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
