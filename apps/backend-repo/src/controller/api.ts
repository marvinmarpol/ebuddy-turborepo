import { Request, Response } from "express";
import { userSchema } from "@repo/entities";

import {
  getUserById,
  getUsersPaginated,
  updateUser,
} from "../repository/userCollection";

const RATING_WEIGHT = 100;
const RENT_WEIGHT = 10;
const RECENT_DIVIDER = 1000000000;
const DEFAULT_PER_PAGE = 10;

export const userList = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || DEFAULT_PER_PAGE;
  const page = parseInt(req.query.page as string, 10) || 1;
  const offset = Math.max(page, 1) - 1;

  try {
    const users = await getUsersPaginated(limit, offset);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data", raw: error });
  }
};

export const fetchUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data", raw: error });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData = req.body;

  const validation = userSchema.safeParse(userData);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.errors,
    });
  }

  let currentRating = validation.data.totalAverageWeightRatings || 0.0;
  let currentRent = validation.data.numberOfRents || 0;
  let currentRecent = validation.data.recentlyActive || 1743016720;

  try {
    const user = await getUserById(userId);
    if (user) {
      if (!currentRating && user.totalAverageWeightRatings) {
        currentRating = user.totalAverageWeightRatings;
      }
      if (!currentRating && user.numberOfRents) {
        currentRent = user.numberOfRents;
      }
      if (!currentRating && user.recentlyActive) {
        currentRecent = user.recentlyActive;
      }
    }
    validation.data.totalPotential =
      currentRating * RATING_WEIGHT +
      currentRent * RENT_WEIGHT +
      currentRecent / RECENT_DIVIDER;

    await updateUser(userId, validation.data);
    res.status(200).json(validation.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user data", raw: error });
  }
};
