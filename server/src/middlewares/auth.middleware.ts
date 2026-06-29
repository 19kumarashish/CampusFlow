import { NextFunction, Request, Response } from "express";

import { authRepository } from "@/modules/auth/repositories/auth.repository";
import { verifyAccessToken } from "@/shared/security/jwt";
import { AuthRequest } from "@/types/auth-request";
import { ApiError } from "@/utils/ApiError";

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;
    const authReq = req as AuthRequest;

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

        authReq.user = user;

        next();
    } catch {
        return next(
            new ApiError(401, "Invalid or expired token"),
        );
    }
};