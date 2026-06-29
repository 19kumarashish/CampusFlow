import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());

app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api", routes);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusFlow API is running",
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

