import { z } from "zod";

import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

// ======================
// Create Enrollment Schema
// ======================

export const createEnrollmentSchema = z.object({
  student: z
    .string()
    .trim()
    .min(1, "Student is required"),

  course: z
    .string()
    .trim()
    .min(1, "Course is required"),

  semester: z
    .string()
    .trim()
    .min(1, "Semester is required"),

  section: z
    .string()
    .trim()
    .min(1, "Section is required"),

  enrollmentDate: z.coerce
    .date()
    .optional(),
});

export type CreateEnrollmentInput = z.infer<
  typeof createEnrollmentSchema
>;

// ======================
// Update Enrollment Schema
// ======================

export const updateEnrollmentSchema = z.object({
  student: z
    .string()
    .trim()
    .optional(),

  course: z
    .string()
    .trim()
    .optional(),

  semester: z
    .string()
    .trim()
    .optional(),

  section: z
    .string()
    .trim()
    .optional(),

  enrollmentDate: z.coerce
    .date()
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),
});

export type UpdateEnrollmentInput = z.infer<
  typeof updateEnrollmentSchema
>;

// ======================
// Get Enrollments Query Schema
// ======================

export const getEnrollmentsQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    student: z
      .string()
      .trim()
      .optional(),

    course: z
      .string()
      .trim()
      .optional(),

    semester: z
      .string()
      .trim()
      .optional(),

    section: z
      .string()
      .trim()
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "enrollmentDate",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type GetEnrollmentsQueryInput = z.infer<
  typeof getEnrollmentsQuerySchema
>;