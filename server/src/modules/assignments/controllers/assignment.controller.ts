import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { assignmentService } from "../services/assignment.service";
import {
  createAssignmentSchema,
  createSubmissionSchema,
  getAssignmentsQuerySchema,
  getSubmissionsQuerySchema,
  gradeSubmissionSchema,
  updateAssignmentSchema,
} from "../validators/assignment.validator";

/* -------------------------------------------------------------------------- */
/*                           Assignment Controllers                           */
/* -------------------------------------------------------------------------- */

// Create Assignment
export const createAssignment = asyncHandler(
  async (
    req: Request,
    res: Response,
  ) => {
    const data =
      createAssignmentSchema.parse(
        req.body,
      );

    const assignment =
      await assignmentService.createAssignment(
        data,
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Assignment created successfully",
        assignment,
      ),
    );
  },
);

// Get Assignments
export const getAssignments = asyncHandler(
  async (
    req: Request,
    res: Response,
  ) => {
    const query =
      getAssignmentsQuerySchema.parse(
        req.query,
      );

    const result =
      await assignmentService.getAssignments(
        query,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Assignments fetched successfully",
        result,
      ),
    );
  },
);

// Get Assignment By ID
export const getAssignmentById =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const assignment =
        await assignmentService.getAssignmentById(
          req.params.id as string,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Assignment fetched successfully",
          assignment,
        ),
      );
    },
  );

// Update Assignment
export const updateAssignment =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        updateAssignmentSchema.parse(
          req.body,
        );

      const assignment =
        await assignmentService.updateAssignment(
          req.params.id as string,
          data,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Assignment updated successfully",
          assignment,
        ),
      );
    },
  );

// Delete Assignment
export const deleteAssignment =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const assignment =
        await assignmentService.deleteAssignment(
          req.params.id as string,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Assignment deleted successfully",
          assignment,
        ),
      );
    },
  );

/* -------------------------------------------------------------------------- */
/*                           Submission Controllers                           */
/* -------------------------------------------------------------------------- */

// Create Submission
export const createSubmission =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        createSubmissionSchema.parse(
          req.body,
        );

      const submission =
        await assignmentService.createSubmission(
          data,
        );

      res.status(201).json(
        new ApiResponse(
          true,
          "Assignment submitted successfully",
          submission,
        ),
      );
    },
  );

// Grade Submission
export const gradeSubmission =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        gradeSubmissionSchema.parse(
          req.body,
        );

      const submission =
        await assignmentService.gradeSubmission(
          req.params.id as string,
          data,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Submission graded successfully",
          submission,
        ),
      );
    },
  );

// Get Submissions
export const getSubmissions =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const query =
        getSubmissionsQuerySchema.parse(
          req.query,
        );

      const result =
        await assignmentService.getSubmissions(
          query,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Submissions fetched successfully",
          result,
        ),
      );
    },
  );