import { z } from "zod";

import { Status } from "@/shared/enums/status.enum";
import { DegreeType } from "@/shared/enums/degree-type.enum";

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

  department: z.string().min(1, "Department is required"),

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

  department: z.string().optional(),

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
  z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),

    search: z.string().optional(),

    department: z
      .string()
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
        "createdAt",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum([
        "asc",
        "desc",
      ])
      .default("desc"),
  });

export type GetCoursesQueryInput =
  z.infer<
    typeof getCoursesQuerySchema
  >;