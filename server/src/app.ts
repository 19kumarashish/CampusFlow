import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusFlow API is running"
  });
});

export default app;