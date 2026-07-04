import { z } from "zod";

import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code cannot exceed 10 characters")
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

export type CreateDepartmentInput =
  z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  code: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .transform((value) => value.toUpperCase())
    .optional(),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),
});

export type UpdateDepartmentInput =
  z.infer<typeof updateDepartmentSchema>;

export const getDepartmentsQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),
  });

export type GetDepartmentsQueryInput =
  z.infer<
    typeof getDepartmentsQuerySchema
  >;