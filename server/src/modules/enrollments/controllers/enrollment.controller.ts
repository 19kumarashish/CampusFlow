import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { enrollmentService } from "../services/enrollment.service";
import {
  createEnrollmentSchema,
  getEnrollmentsQuerySchema,
  updateEnrollmentSchema,
} from "../validators/enrollment.validator";

// ======================
// Create Enrollment
// ======================

export const createEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createEnrollmentSchema.parse(req.body);

    const enrollment =
      await enrollmentService.createEnrollment(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Enrollment created successfully",
        enrollment
      )
    );
  }
);

// ======================
// Get All Enrollments
// ======================

export const getEnrollments = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getEnrollmentsQuerySchema.parse(
      req.query
    );

    const result =
      await enrollmentService.getEnrollments(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Enrollments fetched successfully",
        result
      )
    );
  }
);

// ======================
// Get Enrollment By ID
// ======================

export const getEnrollmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment =
      await enrollmentService.getEnrollmentById(
        String(req.params.id)
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Enrollment fetched successfully",
        enrollment
      )
    );
  }
);

// ======================
// Update Enrollment
// ======================

export const updateEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateEnrollmentSchema.parse(req.body);

    const enrollment =
      await enrollmentService.updateEnrollment(
        String(req.params.id),
        data
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Enrollment updated successfully",
        enrollment
      )
    );
  }
);

// ======================
// Delete Enrollment
// ======================

export const deleteEnrollment = asyncHandler(
  async (req: Request, res: Response) => {
    const enrollment =
      await enrollmentService.deleteEnrollment(
        String(req.params.id)
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Enrollment deleted successfully",
        enrollment
      )
    );
  }
);