import { Router } from "express";

import { ApiResponse } from "../utils/ApiResponse";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      true,
      "CampusFlow API is healthy",
      {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }
    )
  );
});

export default router;