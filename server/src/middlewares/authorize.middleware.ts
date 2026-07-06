import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "@/types/auth-request";
import { ApiError } from "@/utils/ApiError";

export const authorize = (...requiredRoles: string[]) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const authReq = req as AuthRequest;
        const user = authReq.user;

        if (!user) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const roleName =
            typeof user.role === "string"
                ? user.role
                : user.role && "name" in user.role
                    ? user.role.name
                    : user.role?.toString?.();

        if (!roleName) {
            return next(new ApiError(403, "Forbidden"));
        }

        if (!requiredRoles.includes(roleName)) {
            return next(new ApiError(403, "Forbidden"));
        }

        next();
    };
};