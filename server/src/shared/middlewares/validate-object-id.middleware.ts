import { NextFunction,Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "@/utils/ApiError";

export const validateObjectId =
    (paramName = "id") =>
        (
            req: Request,
            _res: Response,
            next: NextFunction,
        ) => {
            const id = req.params[paramName];

            if (Array.isArray(id) || !Types.ObjectId.isValid(id)) {
                return next(
                    new ApiError(
                        400,
                        `Invalid ${paramName}`,
                    ),
                );
            }

            next();
        };