import { z } from "zod";

import { ExamStatus } from "@/shared/enums/exam-status.enum";
import { ExamType } from "@/shared/enums/exam-type.enum";
import { Grade } from "@/shared/enums/grade.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

/**
 * ==========================
 * Regex
 * ==========================
 */

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * ==========================
 * Create Examination
 * ==========================
 */

export const createExaminationSchema = z
  .object({
    title: z.string().trim().min(3).max(200),

    subject: z.string().trim().min(1),

    faculty: z.string().trim().min(1),

    section: z.string().trim().min(1),

    semester: z.string().trim().min(1),

    examType: z.nativeEnum(ExamType),

    date: z.coerce.date(),

    startTime: z.string().regex(timeRegex, "Invalid start time format (HH:mm)"),

    endTime: z.string().regex(timeRegex, "Invalid end time format (HH:mm)"),

    hall: z.string().trim().min(2).max(100),

    maximumMarks: z.number().min(1),

    passingMarks: z.number().min(0),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => data.passingMarks <= data.maximumMarks, {
    message: "Passing marks cannot exceed maximum marks",
    path: ["passingMarks"],
  });

export type CreateExaminationInput = z.infer<
  typeof createExaminationSchema
>;

/**
 * ==========================
 * Update Examination
 * ==========================
 */

export const updateExaminationSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),

    date: z.coerce.date().optional(),

    startTime: z
      .string()
      .regex(timeRegex, "Invalid start time format (HH:mm)")
      .optional(),

    endTime: z
      .string()
      .regex(timeRegex, "Invalid end time format (HH:mm)")
      .optional(),

    hall: z.string().trim().min(2).max(100).optional(),

    maximumMarks: z.number().min(1).optional(),

    passingMarks: z.number().min(0).optional(),

    examType: z.nativeEnum(ExamType).optional(),

    status: z.nativeEnum(ExamStatus).optional(),
  })
  .refine(
    (data) =>
      !data.startTime ||
      !data.endTime ||
      data.endTime > data.startTime,
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) =>
      data.maximumMarks === undefined ||
      data.passingMarks === undefined ||
      data.passingMarks <= data.maximumMarks,
    {
      message: "Passing marks cannot exceed maximum marks",
      path: ["passingMarks"],
    }
  );

export type UpdateExaminationInput = z.infer<
  typeof updateExaminationSchema
>;

/**
 * ==========================
 * Create Exam Result
 * ==========================
 */

export const createExamResultSchema = z.object({
  examination: z.string().trim().min(1),

  enrollment: z.string().trim().min(1),

  obtainedMarks: z.number().min(0),

  remarks: z.string().trim().max(1000).optional(),
});

export type CreateExamResultInput = z.infer<
  typeof createExamResultSchema
>;

/**
 * ==========================
 * Update Exam Result
 * ==========================
 */

export const updateExamResultSchema = z.object({
  obtainedMarks: z.number().min(0).optional(),

  remarks: z.string().trim().max(1000).optional(),
});

export type UpdateExamResultInput = z.infer<
  typeof updateExamResultSchema
>;

/**
 * ==========================
 * Examination Query
 * ==========================
 */

export const getExaminationsQuerySchema =
  paginationSchema.extend({
    subject: z.string().optional(),

    faculty: z.string().optional(),

    section: z.string().optional(),

    semester: z.string().optional(),

    examType: z.nativeEnum(ExamType).optional(),

    status: z.nativeEnum(ExamStatus).optional(),

    sortBy: z
      .enum([
        "date",
        "title",
        "createdAt",
      ])
      .default("date"),
  });

export type GetExaminationsQueryInput = z.infer<
  typeof getExaminationsQuerySchema
>;

/**
 * ==========================
 * Exam Result Query
 * ==========================
 */

export const getExamResultsQuerySchema =
  paginationSchema.extend({
    examination: z.string().optional(),

    enrollment: z.string().optional(),

    grade: z.nativeEnum(Grade).optional(),

    sortBy: z
      .enum([
        "obtainedMarks",
        "createdAt",
      ])
      .default("obtainedMarks"),
  });

export type GetExamResultsQueryInput = z.infer<
  typeof getExamResultsQuerySchema
>;