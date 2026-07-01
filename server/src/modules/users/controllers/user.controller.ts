import { Request, Response } from "express";

import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";

import { userService } from "../services/user.service";
import {
  createUserSchema,
  getUsersQuerySchema,
} from "../validators/user.validator";

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);

    const user = await userService.createUser(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "User created successfully",
        user,
      ),
    );
  },
);

export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getUsersQuerySchema.parse(req.query);

    const result = await userService.getUsers(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Users fetched successfully",
        result,
      ),
    );
  },
);