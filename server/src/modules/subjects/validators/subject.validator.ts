import { z } from "zod";

import { Status } from "@/shared/enums/status.enum";
import { SubjectType } from "@/shared/enums/subject-type.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name cannot exceed 100 characters"),

  code: z
    .string()
    .trim()
    .min(2, "Subject code must be at least 2 characters")
    .max(20, "Subject code cannot exceed 20 characters")
    .transform((value) => value.toUpperCase()),

  department: objectIdSchema,

  course: objectIdSchema,

  semester: z.coerce
    .number()
    .int("Semester must be an integer")
    .min(1, "Semester must be at least 1")
    .max(12, "Semester cannot exceed 12"),

  credits: z.coerce
    .number()
    .int("Credits must be an integer")
    .min(1, "Credits must be at least 1")
    .max(10, "Credits cannot exceed 10"),

  type: z
    .nativeEnum(SubjectType)
    .default(SubjectType.THEORY),
});

export type CreateSubjectInput = z.infer<
  typeof createSubjectSchema
>;

export const updateSubjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Subject name must be at least 2 characters")
      .max(100, "Subject name cannot exceed 100 characters")
      .optional(),

    code: z
      .string()
      .trim()
      .min(2, "Subject code must be at least 2 characters")
      .max(20, "Subject code cannot exceed 20 characters")
      .transform((value) => value.toUpperCase())
      .optional(),

    department: objectIdSchema.optional(),

    course: objectIdSchema.optional(),

    semester: z.coerce
      .number()
      .int("Semester must be an integer")
      .min(1, "Semester must be at least 1")
      .max(12, "Semester cannot exceed 12")
      .optional(),

    credits: z.coerce
      .number()
      .int("Credits must be an integer")
      .min(1, "Credits must be at least 1")
      .max(10, "Credits cannot exceed 10")
      .optional(),

    type: z
      .nativeEnum(SubjectType)
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required to update.",
    },
  );

export type UpdateSubjectInput = z.infer<
  typeof updateSubjectSchema
>;

export const getSubjectsQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    department:
      objectIdSchema.optional(),

    course:
      objectIdSchema.optional(),

    semester: z.coerce
      .number()
      .int()
      .min(1)
      .max(12)
      .optional(),

    type: z
      .nativeEnum(SubjectType)
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "name",
        "code",
        "semester",
        "credits",
        "createdAt",
        "updatedAt",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export type GetSubjectsQueryInput = z.infer<
  typeof getSubjectsQuerySchema
>;