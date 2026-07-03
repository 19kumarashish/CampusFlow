import { Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { departmentService } from "../services/department.service";
import {
    createDepartmentSchema,
    getDepartmentsQuerySchema,
    updateDepartmentSchema,
} from "../validators/department.validator";

export const createDepartment = asyncHandler(
    async (req: Request, res: Response) => {
        const data = createDepartmentSchema.parse(req.body);

        const department =
            await departmentService.createDepartment(data);

        res.status(201).json(
            new ApiResponse(true, "Department created successfully", department),
        );
    },
);

export const getDepartments = asyncHandler(
    async (req: Request, res: Response) => {
        const query = getDepartmentsQuerySchema.parse(req.query);

        const result =
            await departmentService.getDepartments(query);

        res.status(200).json(
            new ApiResponse(true, "Departments fetched successfully", result),
        );
    },
);

export const getDepartmentById = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid department id");
        }

        const department = await departmentService.getDepartmentById(id);

        res.status(200).json(
            new ApiResponse(true, "Department fetched successfully", department),
        );
    },
);

export const updateDepartment = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid department id");
        }

        const data = updateDepartmentSchema.parse(req.body);

        const department = await departmentService.updateDepartment(id, data);

        res.status(200).json(
            new ApiResponse(true, "Department updated successfully", department),
        );
    },
);

export const deleteDepartment = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid department id");
        }

        await departmentService.deleteDepartment(id);

        res.status(200).json(
            new ApiResponse(true, "Department deleted successfully", null),
        );
    },
);