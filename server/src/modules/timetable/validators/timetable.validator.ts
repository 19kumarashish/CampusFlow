import { z } from "zod";

import { Day } from "@/shared/enums/day.enum";
import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

/* -------------------------------------------------------------------------- */
/*                                Time Regex                                  */
/* -------------------------------------------------------------------------- */

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/* -------------------------------------------------------------------------- */
/*                           Create Timetable Schema                          */
/* -------------------------------------------------------------------------- */

export const createTimetableSchema = z
  .object({
    section: z
      .string()
      .trim()
      .min(1, "Section is required"),

    subject: z
      .string()
      .trim()
      .min(1, "Subject is required"),

    faculty: z
      .string()
      .trim()
      .min(1, "Faculty is required"),

    classroom: z
      .string()
      .trim()
      .min(2, "Classroom must be at least 2 characters")
      .max(50, "Classroom cannot exceed 50 characters"),

    day: z.nativeEnum(Day),

    startTime: z
      .string()
      .regex(
        timeRegex,
        "Invalid time format. Use HH:mm"
      ),

    endTime: z
      .string()
      .regex(
        timeRegex,
        "Invalid time format. Use HH:mm"
      ),
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type CreateTimetableInput = z.infer<
  typeof createTimetableSchema
>;

/* -------------------------------------------------------------------------- */
/*                           Update Timetable Schema                          */
/* -------------------------------------------------------------------------- */

export const updateTimetableSchema = z
  .object({
    section: z
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

    classroom: z
      .string()
      .trim()
      .min(2, "Classroom must be at least 2 characters")
      .max(50, "Classroom cannot exceed 50 characters")
      .optional(),

    day: z
      .nativeEnum(Day)
      .optional(),

    startTime: z
      .string()
      .regex(
        timeRegex,
        "Invalid time format. Use HH:mm"
      )
      .optional(),

    endTime: z
      .string()
      .regex(
        timeRegex,
        "Invalid time format. Use HH:mm"
      )
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }

      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type UpdateTimetableInput = z.infer<
  typeof updateTimetableSchema
>;

/* -------------------------------------------------------------------------- */
/*                            Get Timetable Query                             */
/* -------------------------------------------------------------------------- */

export const getTimetableQuerySchema =
  paginationSchema.extend({
    section: z
      .string()
      .trim()
      .optional(),

    faculty: z
      .string()
      .trim()
      .optional(),

    subject: z
      .string()
      .trim()
      .optional(),

    classroom: z
      .string()
      .trim()
      .optional(),

    day: z
      .nativeEnum(Day)
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "day",
        "startTime",
        "createdAt",
      ])
      .default("day"),
  });

export type GetTimetableQueryInput = z.infer<
  typeof getTimetableQuerySchema
>;