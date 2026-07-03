import { Types } from "mongoose";
import { Request, Response } from "express";

import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { userService } from "../services/user.service";

import {
  changePasswordSchema,
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema,
  updateProfileSchema,
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

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (Array.isArray(id) || !Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await userService.getUserById(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "User fetched successfully",
        user,
      ),
    );
  },
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (Array.isArray(id) || !Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        "Invalid user id",
      );
    }

    const data = updateUserSchema.parse(req.body);

    const user = await userService.updateUser(
      id,
      data,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "User updated successfully",
        user,
      ),
    );
  },
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(
        400,
        "Invalid user id",
      );
    }

    const user = await userService.deleteUser(id);

    res.status(200).json(
      new ApiResponse(
        true,
        "User deleted successfully",
        user,
      ),
    );
  },
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = changePasswordSchema.parse(req.body);

    const result = await userService.changePassword(
      req.user!.id,
      data,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Password changed successfully",
        result,
      ),
    );
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const data =
      updateProfileSchema.parse(req.body);

    const user =
      await userService.updateProfile(
        req.user!.userId,
        data,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Profile updated successfully",
        user,
      ),
    );
  },
);