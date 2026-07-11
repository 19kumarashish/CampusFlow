import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import routes from "./routes";

const app = express();

const allowedOrigins = env.CLIENT_URL.split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true;

  const normalizedOrigin = origin.trim().toLowerCase();

  if (allowedOrigins.includes(normalizedOrigin) || allowedOrigins.includes("*")) {
    return true;
  }

  return (
    normalizedOrigin.startsWith("http://localhost:") ||
    normalizedOrigin.startsWith("http://127.0.0.1:") ||
    normalizedOrigin.startsWith("https://localhost:") ||
    normalizedOrigin.endsWith(".vercel.app") ||
    normalizedOrigin.endsWith(".vercel.dev") ||
    normalizedOrigin.endsWith(".netlify.app")
  );
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
  ],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

app.use(helmet());

app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;

