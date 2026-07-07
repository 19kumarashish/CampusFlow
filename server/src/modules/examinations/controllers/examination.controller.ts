import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { examinationService } from "../services/examination.service";
import {
  createExaminationSchema,
  createExamResultSchema,
  getExaminationsQuerySchema,
  getExamResultsQuerySchema,
  updateExaminationSchema,
  updateExamResultSchema,
} from "../validators/examination.validator";

export const createExamination =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      createExaminationSchema.parse(req.body);

    const examination =
      await examinationService.createExamination(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Examination created successfully",
        examination,
      ),
    );
  });

export const getExaminations =
  asyncHandler(async (req: Request, res: Response) => {
    const query =
      getExaminationsQuerySchema.parse(req.query);

    const result =
      await examinationService.getExaminations(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Examinations fetched successfully",
        result,
      ),
    );
  });

export const getExaminationById =
  asyncHandler(async (req: Request, res: Response) => {
    const examination =
      await examinationService.getExaminationById(
        req.params.id as string,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Examination fetched successfully",
        examination,
      ),
    );
  });

export const updateExamination =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      updateExaminationSchema.parse(req.body);

    const examination =
      await examinationService.updateExamination(
        req.params.id as string,
        data,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Examination updated successfully",
        examination,
      ),
    );
  });

export const deleteExamination =
  asyncHandler(async (req: Request, res: Response) => {
    const examination =
      await examinationService.deleteExamination(
        req.params.id as string,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Examination deleted successfully",
        examination,
      ),
    );
  });

export const createExamResult =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      createExamResultSchema.parse(req.body);

    const result =
      await examinationService.createExamResult(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Exam result created successfully",
        result,
      ),
    );
  });

export const updateExamResult =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      updateExamResultSchema.parse(req.body);

    const result =
      await examinationService.updateExamResult(
        req.params.id as string,
        data,
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Exam result updated successfully",
        result,
      ),
    );
  });

export const getExamResults =
  asyncHandler(async (req: Request, res: Response) => {
    const query =
      getExamResultsQuerySchema.parse(req.query);

    const result =
      await examinationService.getExamResults(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Exam results fetched successfully",
        result,
      ),
    );
  });