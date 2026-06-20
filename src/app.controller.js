import { env } from "../config/config.service.js";
import express from "express";
import { authRouter, userRouter, messageRouter } from "./modules/index.js";
import { connectDb, redisConnection, webSocketConnect } from "./db/index.js";
import passport from "passport";
import "../config/passport.config.js";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

export const runningApp = function () {
  const app = express();

  const server = createServer(app);
  console.log("Server is starting..."); // Log server start

  const allowedOrigins = [
    env.urlBack,
    env.urlFront,
    "https://ais-dev-h3waqvwvfa43brnufnwg6i-584915043997.europe-west2.run.app",
    "https://ais-pre-h3waqvwvfa43brnufnwg6i-584915043997.europe-west2.run.app",
  ];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  connectDb();
  redisConnection();
  app.use(helmet());
  webSocketConnect(io);
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.static(join(__dirname, "public")));
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use(passport.initialize());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/messages", messageRouter);

  app.use((err, req, res, next) => {
    if (err.name === "TokenExpiredError") {
      err.message = "token invalid, please login";
      err.cause = 401;
    }
    res.status(err.cause || 500).json({
      succes: false,
      message: err.message,
      details: err.details,
      stack: err.stack,
    });
  });

  server.listen(env.port, () => {
    console.log(`App is running on port ${env.port}`);
  });
};
