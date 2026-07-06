import { z } from "zod";

import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createAttendanceSchema =
  z.object({
    enrollment: z
      .string()
      .trim()
      .min(1, "Enrollment is required"),

    subject: z
      .string()
      .trim()
      .min(1, "Subject is required"),

    faculty: z
      .string()
      .trim()
      .min(1, "Faculty is required"),

    date: z.coerce.date(),

    lectureNumber: z
      .number()
      .int()
      .min(1)
      .max(20),

    status: z.nativeEnum(
      AttendanceStatus,
    ),

    remarks: z
      .string()
      .trim()
      .max(500)
      .optional(),
  });

export type CreateAttendanceInput =
  z.infer<
    typeof createAttendanceSchema
  >;

export const updateAttendanceSchema =
  z.object({
    enrollment: z
      .string()
      .trim()
      .optional(),

    subject: z
      .string()
      .trim()
      .optional(),

    faculty: z
      .string()
      .trim()
      .optional(),

    date: z.coerce
      .date()
      .optional(),

    lectureNumber: z
      .number()
      .int()
      .min(1)
      .max(20)
      .optional(),

    status: z
      .nativeEnum(
        AttendanceStatus,
      )
      .optional(),

    remarks: z
      .string()
      .trim()
      .max(500)
      .optional(),
  });

export type UpdateAttendanceInput =
  z.infer<
    typeof updateAttendanceSchema
  >;

export const getAttendanceQuerySchema =
  paginationSchema.extend({
    enrollment: z
      .string()
      .trim()
      .optional(),

    subject: z
      .string()
      .trim()
      .optional(),

    faculty: z
      .string()
      .trim()
      .optional(),

    date: z
      .string()
      .optional(),

    status: z
      .nativeEnum(
        AttendanceStatus,
      )
      .optional(),

    sortBy: z
      .enum([
        "date",
        "lectureNumber",
        "createdAt",
      ])
      .default("date"),
  });

export type GetAttendanceQueryInput =
  z.infer<
    typeof getAttendanceQuerySchema
  >;
