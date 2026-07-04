import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { studentService } from "../services/student.service";
import {
  createStudentSchema,
  getStudentsQuerySchema,
  updateStudentSchema,
} from "../validators/student.validator";

/**
 * Create Student
 */
export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createStudentSchema.parse(
      req.body,
    );

    const student =
      await studentService.createStudent(
        data,
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Student created successfully",
        student,
      ),
    );
  },
);

/**
 * Get All Students
 */
export const getStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const query =
      getStudentsQuerySchema.parse(
        req.query,
      );

    const result =
      await studentService.getStudents(
        query,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Students fetched successfully",
        result,
      ),
    );
  },
);

/**
 * Get Student By ID
 */
export const getStudentById =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const student =
        await studentService.getStudentById(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Student fetched successfully",
          student,
        ),
      );
    },
  );

/**
 * Update Student
 */
export const updateStudent =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const data =
        updateStudentSchema.parse(
          req.body,
        );

      const student =
        await studentService.updateStudent(
          String(req.params.id),
          data,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Student updated successfully",
          student,
        ),
      );
    },
  );

/**
 * Delete Student (Soft Delete)
 */
export const deleteStudent =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const student =
        await studentService.deleteStudent(
          String(req.params.id),
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Student deleted successfully",
          student,
        ),
      );
    },
  );