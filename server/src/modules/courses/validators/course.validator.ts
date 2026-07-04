import { z } from "zod";

import { DegreeType } from "@/shared/enums/degree-type.enum";
import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createCourseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Course name must be at least 2 characters")
    .max(100, "Course name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Course code must be at least 2 characters")
    .max(20, "Course code cannot exceed 20 characters")
    .transform((value) => value.toUpperCase()),

  department: z
    .string()
    .trim()
    .min(1, "Department is required"),

  degree: z.nativeEnum(DegreeType),

  duration: z
    .number()
    .int()
    .min(1)
    .max(10),

  totalSemesters: z
    .number()
    .int()
    .min(1)
    .max(20),
});

export type CreateCourseInput =
  z.infer<typeof createCourseSchema>;

export const updateCourseSchema = z.object({
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
    .max(20)
    .transform((value) => value.toUpperCase())
    .optional(),

  department: z
    .string()
    .trim()
    .optional(),

  degree: z
    .nativeEnum(DegreeType)
    .optional(),

  duration: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional(),

  totalSemesters: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),
});

export type UpdateCourseInput =
  z.infer<typeof updateCourseSchema>;

export const getCoursesQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    department: z
      .string()
      .trim()
      .optional(),

    degree: z
      .nativeEnum(DegreeType)
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "name",
        "code",
        "degree",
        "duration",
        "totalSemesters",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type GetCoursesQueryInput =
  z.infer<typeof getCoursesQuerySchema>;