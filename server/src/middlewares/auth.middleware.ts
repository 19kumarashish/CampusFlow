import { NextFunction, Request, Response } from "express";

import { ApiError } from "@/utils/ApiError";
import { verifyAccessToken } from "@/shared/security/jwt";
import { authRepository } from "@/modules/auth/repositories/auth.repository";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return next(
      new ApiError(401, "Unauthorized"),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    const user = await authRepository.findById(
      payload.userId,
    );

    if (!user) {
      return next(
        new ApiError(401, "User not found"),
      );
    }

    req.user = user;

    next();
  } catch {
    return next(
      new ApiError(401, "Invalid or expired token"),
    );
  }
};