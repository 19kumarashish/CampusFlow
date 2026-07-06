import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { attendanceService } from "../services/attendance.service";
import {
  createAttendanceSchema,
  getAttendanceQuerySchema,
  updateAttendanceSchema,
} from "../validators/attendance.validator";

export const createAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createAttendanceSchema.parse(req.body);

    const attendance = await attendanceService.createAttendance(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Attendance marked successfully",
        attendance,
      ),
    );
  },
);

export const getAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getAttendanceQuerySchema.parse(req.query);

    const result = await attendanceService.getAttendance(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Attendance fetched successfully",
        result,
      ),
    );
  },
);

export const getAttendanceById = asyncHandler(
  async (req: Request, res: Response) => {
    const attendance = await attendanceService.getAttendanceById(req.params.id as string);

    res.status(200).json(
      new ApiResponse(
        true,
        "Attendance fetched successfully",
        attendance,
      ),
    );
  },
);

export const updateAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateAttendanceSchema.parse(req.body);

    const attendance = await attendanceService.updateAttendance(
      req.params.id as string,
      data,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Attendance updated successfully",
        attendance,
      ),
    );
  },
);

export const deleteAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const attendance = await attendanceService.deleteAttendance(req.params.id as string);

    res.status(200).json(
      new ApiResponse(
        true,
        "Attendance deleted successfully",
        attendance,
      ),
    );
  },
);

export const getAttendancePercentage = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await attendanceService.getAttendancePercentage(
      req.params.enrollmentId as string,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Attendance percentage calculated successfully",
        result,
      ),
    );
  },
);