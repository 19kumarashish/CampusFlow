import { z } from "zod";

import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

// ======================
// Create Section Schema
// ======================

export const createSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Section name is required")
    .max(10, "Section name cannot exceed 10 characters")
    .transform((value) => value.toUpperCase()),

  semester: z
    .string()
    .trim()
    .min(1, "Semester is required"),

  capacity: z
    .number()
    .int()
    .min(1, "Capacity must be at least 1")
    .max(300, "Capacity cannot exceed 300"),

  classroom: z
    .string()
    .trim()
    .min(2, "Classroom is required")
    .max(50, "Classroom cannot exceed 50 characters"),

  facultyAdvisor: z
    .string()
    .trim()
    .min(1, "Faculty advisor is required"),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;

// ======================
// Update Section Schema
// ======================

export const updateSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(10)
    .transform((value) => value.toUpperCase())
    .optional(),

  semester: z
    .string()
    .trim()
    .optional(),

  capacity: z
    .number()
    .int()
    .min(1)
    .max(300)
    .optional(),

  classroom: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  facultyAdvisor: z
    .string()
    .trim()
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

// ======================
// Get Sections Query Schema
// ======================

export const getSectionsQuerySchema = paginationSchema.extend({
  search: z
    .string()
    .trim()
    .optional(),

  semester: z
    .string()
    .trim()
    .optional(),

  facultyAdvisor: z
    .string()
    .trim()
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),

  sortBy: z
    .enum([
      "name",
      "capacity",
      "createdAt",
    ])
    .default("createdAt"),
});

export type GetSectionsQueryInput = z.infer<
  typeof getSectionsQuerySchema
>;