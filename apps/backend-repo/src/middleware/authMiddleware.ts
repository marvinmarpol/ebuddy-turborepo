import admin from "firebase-admin";

import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token", raw: error });
  }
};
