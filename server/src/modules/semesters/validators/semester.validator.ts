import { z } from "zod";

import { SemesterType } from "@/shared/enums/semester-type.enum";
import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

/* -------------------------------------------------------------------------- */
/*                           Create Semester Schema                           */
/* -------------------------------------------------------------------------- */

const semesterBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Semester name must be at least 2 characters")
    .max(100, "Semester name cannot exceed 100 characters"),

  semesterNumber: z
    .number()
    .int()
    .min(1)
    .max(12),

  type: z.nativeEnum(SemesterType),

  academicYear: z
    .string()
    .trim()
    .regex(
      /^\d{4}-\d{2}$/,
      "Academic year must be in YYYY-YY format (e.g. 2026-27)",
    ),

  course: z
    .string()
    .trim()
    .min(1, "Course is required"),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  registrationStart: z.coerce.date(),

  registrationEnd: z.coerce.date(),

  examStart: z.coerce.date(),

  examEnd: z.coerce.date(),

  resultDate: z.coerce.date(),

  isCurrent: z.boolean().default(false),
});

type SemesterValidationData = {
  registrationStart: Date;
  registrationEnd: Date;
  startDate: Date;
  endDate: Date;
  examStart: Date;
  examEnd: Date;
  resultDate: Date;
};

const applySemesterRefinements = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data, ctx) => {
    const typedData = data as SemesterValidationData;

    // Registration period
    if (typedData.registrationStart > typedData.registrationEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationEnd"],
        message: "Registration end must be after registration start",
      });
    }

    // Semester period
    if (typedData.startDate > typedData.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Semester end must be after semester start",
      });
    }

    // Exam period
    if (typedData.examStart > typedData.examEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["examEnd"],
        message: "Exam end must be after exam start",
      });
    }

    // Exam cannot start before semester
    if (typedData.examStart < typedData.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["examStart"],
        message: "Exam cannot start before the semester starts",
      });
    }

    // Result declaration
    if (typedData.resultDate < typedData.examEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["resultDate"],
        message: "Result date must be after exams end",
      });
    }
  });

export const createSemesterSchema = applySemesterRefinements(
  semesterBaseSchema,
);

export type CreateSemesterInput =
  z.infer<typeof createSemesterSchema>;

/* -------------------------------------------------------------------------- */
/*                           Update Semester Schema                           */
/* -------------------------------------------------------------------------- */

export const updateSemesterSchema = applySemesterRefinements(
  semesterBaseSchema.partial().extend({
    status: z.nativeEnum(Status).optional(),
  }),
);

export type UpdateSemesterInput =
  z.infer<typeof updateSemesterSchema>;

/* -------------------------------------------------------------------------- */
/*                            Get Semesters Query                             */
/* -------------------------------------------------------------------------- */

export const getSemestersQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    course: z
      .string()
      .trim()
      .optional(),

    academicYear: z
      .string()
      .trim()
      .optional(),

    semesterNumber: z.coerce
      .number()
      .int()
      .optional(),

    type: z
      .nativeEnum(SemesterType)
      .optional(),

    isCurrent: z.coerce
      .boolean()
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "semesterNumber",
        "academicYear",
        "startDate",
        "createdAt",
      ])
      .default("createdAt"),

    sortOrder: z
      .enum(["asc", "desc"])
      .default("desc"),
  });

export type GetSemestersQueryInput =
  z.infer<typeof getSemestersQuerySchema>;