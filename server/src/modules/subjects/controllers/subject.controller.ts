import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { subjectService } from "../services/subject.service";
import {
  createSubjectSchema,
  getSubjectsQuerySchema,
  updateSubjectSchema,
} from "../validators/subject.validator";

export const createSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createSubjectSchema.parse(req.body);

    const subject = await subjectService.createSubject(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Subject created successfully",
        subject,
      ),
    );
  },
);

export const getSubjects = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getSubjectsQuerySchema.parse(req.query);

    const subjects = await subjectService.getSubjects(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Subjects fetched successfully",
        subjects,
      ),
    );
  },
);

export const getSubjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const subject = await subjectService.getSubjectById(
      String(req.params.id),
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Subject fetched successfully",
        subject,
      ),
    );
  },
);

export const updateSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateSubjectSchema.parse(req.body);

    const subject = await subjectService.updateSubject(
      String(req.params.id),
      data,
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Subject updated successfully",
        subject,
      ),
    );
  },
);

export const deleteSubject = asyncHandler(
  async (req: Request, res: Response) => {
    await subjectService.deleteSubject(String(req.params.id));

    res.status(200).json(
      new ApiResponse(
        true,
        "Subject deleted successfully",
        null,
      ),
    );
  },
);