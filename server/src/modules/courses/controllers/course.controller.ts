import { Request, Response } from "express";
import { Types } from "mongoose";

import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";

import { courseService } from "../services/course.service";

import {
    createCourseSchema,
    updateCourseSchema,
    getCoursesQuerySchema,
} from "../validators/course.validator";

export const createCourse = asyncHandler(
    async (req: Request, res: Response) => {
        const data = createCourseSchema.parse(req.body);

        const course = await courseService.createCourse(data);

        res.status(201).json(
            new ApiResponse(true, "Course created successfully", course),
        );
    },
);

export const getCourses = asyncHandler(
    async (req: Request, res: Response) => {
        const query = getCoursesQuerySchema.parse(req.query);

        const result = await courseService.getCourses(query);

        res.status(200).json(
            new ApiResponse(true, "Courses fetched successfully", result),
        );
    },
);

export const getCourseById = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid course id");
        }

        const course = await courseService.getCourseById(id);

        res.status(200).json(
            new ApiResponse(true, "Course fetched successfully", course),
        );
    },
);

export const updateCourse = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid course id");
        }

        const data = updateCourseSchema.parse(req.body);

        const course = await courseService.updateCourse(id, data);

        res.status(200).json(
            new ApiResponse(true, "Course updated successfully", course),
        );
    },
);

export const deleteCourse = asyncHandler(
    async (req: Request, res: Response) => {
        const id = String(req.params.id);

        if (Array.isArray(req.params.id) || !Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid course id");
        }

        await courseService.deleteCourse(id);

        res.status(200).json(
            new ApiResponse(true, "Course deleted successfully", null),
        );
    },
);
