import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { authService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request
    const data = loginSchema.parse(req.body);

    // Business logic
    const result = await authService.login(data);

    // Refresh Token Cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Response
    res.status(200).json(
      new ApiResponse(true, "Login successful", {
        accessToken: result.accessToken,
        user: result.user,
      }),
    );
  },
);