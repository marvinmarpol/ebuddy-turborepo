import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "../routes/userRoutes";

export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    
    .use("/api", userRoutes)

    .get("/status", (_, res) => {
      return res.status(200).json({ ok: true });
    });

  return app;
};
