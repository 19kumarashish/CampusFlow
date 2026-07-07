import { z } from "zod";

import { ResultStatus } from "@/shared/enums/result-status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

// ======================
// Result
// ======================

export const createResultSchema = z.object({
  enrollment: z
    .string()
    .trim()
    .min(1, "Enrollment is required"),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required"),
});

export type CreateResultInput =
  z.infer<typeof createResultSchema>;

export const updateResultSchema = z.object({
  status: z.nativeEnum(ResultStatus),
});

export type UpdateResultInput =
  z.infer<typeof updateResultSchema>;

// ======================
// Semester Result
// ======================

export const createSemesterResultSchema = z.object({
  enrollment: z
    .string()
    .trim()
    .min(1, "Enrollment is required"),

  semester: z
    .string()
    .trim()
    .min(1, "Semester is required"),
});

export type CreateSemesterResultInput =
  z.infer<typeof createSemesterResultSchema>;

// ======================
// Result Queries
// ======================

export const getResultsQuerySchema =
  paginationSchema.extend({
    enrollment: z.string().trim().optional(),

    subject: z.string().trim().optional(),

    status: z
      .nativeEnum(ResultStatus)
      .optional(),

    sortBy: z
      .enum([
        "percentage",
        "gradePoint",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type GetResultsQueryInput =
  z.infer<typeof getResultsQuerySchema>;

// ======================
// Semester Result Queries
// ======================

export const getSemesterResultsQuerySchema =
  paginationSchema.extend({
    enrollment: z.string().trim().optional(),

    semester: z.string().trim().optional(),

    status: z
      .nativeEnum(ResultStatus)
      .optional(),

    sortBy: z
      .enum([
        "sgpa",
        "cgpa",
      ])
      .default("sgpa"),
  });

export type GetSemesterResultsQueryInput =
  z.infer<typeof getSemesterResultsQuerySchema>;