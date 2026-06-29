import { Request, Response } from "express";

import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { authService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(
      new ApiResponse(true, "Login successful", {
        accessToken: result.accessToken,
        user: result.user,
      }),
    );
  },
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new ApiError(401, "Refresh token is required");
    }

    const result = await authService.refreshToken(token);

    res.status(200).json(
      new ApiResponse(
        true,
        "Access token refreshed",
        result,
      ),
    );
  },
);