import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { facultyService } from "../services/faculty.service";
import {
  createFacultySchema,
  getFacultiesQuerySchema,
  updateFacultySchema,
} from "../validators/faculty.validator";
export const createFaculty = asyncHandler(
  async (req: Request, res: Response) => {
    const data =
      createFacultySchema.parse(req.body);

    const faculty =
      await facultyService.createFaculty(
        data,
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Faculty created successfully",
        faculty,
      ),
    );
  },
);
export const getFaculties = asyncHandler(
  async (req: Request, res: Response) => {
    const query =
      getFacultiesQuerySchema.parse(
        req.query,
      );

    const result =
      await facultyService.getFaculties(
        query,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Faculties fetched successfully",
        result,
      ),
    );
  },
);
export const getFacultyById =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const faculty =
        await facultyService.getFacultyById(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Faculty fetched successfully",
          faculty,
        ),
      );
    },
  );
export const updateFaculty =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        updateFacultySchema.parse(
          req.body,
        );

      const faculty =
        await facultyService.updateFaculty(
          String(req.params.id),
          data,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Faculty updated successfully",
          faculty,
        ),
      );
    },
  );
  export const deleteFaculty =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const faculty =
        await facultyService.deleteFaculty(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Faculty deleted successfully",
          faculty,
        ),
      );
    },
  );