import { Request, Response } from "express";

import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { sectionService } from "../services/section.service";
import {
  createSectionSchema,
  getSectionsQuerySchema,
  updateSectionSchema,
} from "../validators/section.validator";

// ======================
// Create Section
// ======================

export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const data = createSectionSchema.parse(req.body);

    const section = await sectionService.createSection(data);

    res.status(201).json(
      new ApiResponse(
        true,
        "Section created successfully",
        section
      )
    );
  }
);

// ======================
// Get All Sections
// ======================

export const getSections = asyncHandler(
  async (req: Request, res: Response) => {
    const query = getSectionsQuerySchema.parse(req.query);

    const result = await sectionService.getSections(query);

    res.status(200).json(
      new ApiResponse(
        true,
        "Sections fetched successfully",
        result
      )
    );
  }
);

// ======================
// Get Section By ID
// ======================

export const getSectionById = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await sectionService.getSectionById(
      String(req.params.id)
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Section fetched successfully",
        section
      )
    );
  }
);

// ======================
// Update Section
// ======================

export const updateSection = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateSectionSchema.parse(req.body);

    const section = await sectionService.updateSection(
      String(req.params.id),
      data
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Section updated successfully",
        section
      )
    );
  }
);

// ======================
// Delete Section
// ======================

export const deleteSection = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await sectionService.deleteSection(
      String(req.params.id)
    );

    res.status(200).json(
      new ApiResponse(
        true,
        "Section deleted successfully",
        section
      )
    );
  }
);