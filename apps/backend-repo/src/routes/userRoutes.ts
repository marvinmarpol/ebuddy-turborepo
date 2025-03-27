import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import { fetchUserData, updateUserData, userList } from "../controller/api";

const userRoutes = express.Router();

userRoutes.get("/users", authMiddleware, userList);
userRoutes.get("/fetch-user-data/:id", authMiddleware, fetchUserData);
userRoutes.post("/update-user-data", authMiddleware, updateUserData);

export default userRoutes;
