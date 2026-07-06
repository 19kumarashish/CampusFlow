import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { timetableService } from "../services/timetable.service";
import {
  createTimetableSchema,
  getTimetableQuerySchema,
  updateTimetableSchema,
} from "../validators/timetable.validator";

export const createTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createTimetableSchema.parse(req.body);

    const timetable = await timetableService.createTimetable(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Timetable created successfully",
        timetable,
      ),
    );
  },
);

export const getTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getTimetableQuerySchema.parse(req.query);

    const result = await timetableService.getTimetable(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Timetable fetched successfully",
        result,
      ),
    );
  },
);

export const getTimetableById = asyncHandler(
  async (req: Request, res: Response) => {
    const timetable = await timetableService.getTimetableById(
      req.params.id as string,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Timetable fetched successfully",
        timetable,
      ),
    );
  },
);

export const updateTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateTimetableSchema.parse(req.body);

    const timetable = await timetableService.updateTimetable(
      req.params.id as string,
      data,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Timetable updated successfully",
        timetable,
      ),
    );
  },
);

export const deleteTimetable = asyncHandler(
  async (req: Request, res: Response) => {
    const timetable = await timetableService.deleteTimetable(
      req.params.id as string,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Timetable deleted successfully",
        timetable,
      ),
    );
  },
);