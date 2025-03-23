import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import { fetchUserData, updateUserData } from "../controller/api";

const userRoutes = express.Router();

userRoutes.get("/fetch-user-data/:id", authMiddleware, fetchUserData);
userRoutes.post("/update-user-data/:id", authMiddleware, updateUserData);

export default userRoutes;
