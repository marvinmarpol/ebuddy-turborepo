import { Request, Response } from "express";
import { getUserById, updateUser } from "../repository/userCollection";

export const fetchUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data", raw: error });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    await updateUser(userId, userData);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user data", raw: error });
  }
};
