import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { semesterService } from "../services/semester.service";
import {
  createSemesterSchema,
  getSemestersQuerySchema,
  updateSemesterSchema,
} from "../validators/semester.validator";
export const createSemester =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        createSemesterSchema.parse(
          req.body,
        );

      const semester =
        await semesterService.createSemester(
          data,
        );

      res.status(201).json(
        new ApiResponse(
          true,
          "Semester created successfully",
          semester,
        ),
      );
    },
  );
export const getSemesters =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const query =
        getSemestersQuerySchema.parse(
          req.query,
        );

      const result =
        await semesterService.getSemesters(
          query,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Semesters fetched successfully",
          result,
        ),
      );
    },
  );
export const getSemesterById =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const semester =
        await semesterService.getSemesterById(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Semester fetched successfully",
          semester,
        ),
      );
    },
  );
export const updateSemester =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        updateSemesterSchema.parse(
          req.body,
        );

      const semester =
        await semesterService.updateSemester(
          String(req.params.id),
          data,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Semester updated successfully",
          semester,
        ),
      );
    },
  );
export const deleteSemester =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const semester =
        await semesterService.deleteSemester(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Semester deleted successfully",
          semester,
        ),
      );
    },
  );