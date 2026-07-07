import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { resultService } from "../services/result.service";
import {
  createResultSchema,
  createSemesterResultSchema,
  getResultsQuerySchema,
  getSemesterResultsQuerySchema,
} from "../validators/result.validator";

export const createResult =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      createResultSchema.parse(req.body);

    const result =
      await resultService.createResult(
        data.enrollment,
        data.subject,
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Result generated successfully",
        result,
      ),
    );
  });

export const getResults =
  asyncHandler(async (req: Request, res: Response) => {
    const query =
      getResultsQuerySchema.parse(req.query);

    const results =
      await resultService.getResults(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Results fetched successfully",
        results,
      ),
    );
  });

export const generateSemesterResult =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      createSemesterResultSchema.parse(req.body);

    const semesterResult =
      await resultService.generateSemesterResult(
        data.enrollment,
        data.semester,
      );

    res.status(201).json(
      new ApiResponse(
        true,
        "Semester result generated successfully",
        semesterResult,
      ),
    );
  });

  export const getSemesterResults =
  asyncHandler(async (req: Request, res: Response) => {
    const query =
      getSemesterResultsQuerySchema.parse(req.query);

    const semesterResults =
      await resultService.getSemesterResults(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Semester results fetched successfully",
        semesterResults,
      ),
    );
  });

  export const publishResult =
  asyncHandler(async (req: Request, res: Response) => {
    const result =
      await resultService.publishResult(
        req.params.id as string,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Result published successfully",
        result,
      ),
    );
  });
  export const generateTranscript =
  asyncHandler(async (req: Request, res: Response) => {
    const transcript =
      await resultService.generateTranscript(
        req.params.enrollmentId as string,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Transcript generated successfully",
        transcript,
      ),
    );
  });