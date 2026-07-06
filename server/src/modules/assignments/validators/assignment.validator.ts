import { z } from "zod";

import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";
import { SubmissionStatus } from "@/shared/enums/submission-status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

/* -------------------------------------------------------------------------- */
/*                            Attachment Schema                               */
/* -------------------------------------------------------------------------- */

const attachmentSchema = z.object({
  url: z.string().url(),

  fileName: z
    .string()
    .trim()
    .min(1)
    .max(255),

  mimeType: z
    .string()
    .trim()
    .min(1),

  size: z
    .number()
    .positive(),
});

/* -------------------------------------------------------------------------- */
/*                           Assignment Validators                            */
/* -------------------------------------------------------------------------- */

// Create Assignment
export const createAssignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200),

  description: z
    .string()
    .trim()
    .min(10),

  subject: z
    .string()
    .trim()
    .min(1),

  faculty: z
    .string()
    .trim()
    .min(1),

  section: z
    .string()
    .trim()
    .min(1),

  semester: z
    .string()
    .trim()
    .min(1),

  dueDate: z.coerce.date(),

  maxMarks: z
    .number()
    .min(1)
    .max(1000),

  attachments: z
    .array(attachmentSchema)
    .default([]),

  status: z
    .nativeEnum(AssignmentStatus)
    .optional(),
});

export type CreateAssignmentInput =
  z.infer<typeof createAssignmentSchema>;

// Update Assignment
export const updateAssignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .optional(),

  description: z
    .string()
    .trim()
    .min(10)
    .optional(),

  dueDate: z
    .coerce
    .date()
    .optional(),

  maxMarks: z
    .number()
    .min(1)
    .max(1000)
    .optional(),

  attachments: z
    .array(attachmentSchema)
    .optional(),

  status: z
    .nativeEnum(AssignmentStatus)
    .optional(),
});

export type UpdateAssignmentInput =
  z.infer<typeof updateAssignmentSchema>;

/* -------------------------------------------------------------------------- */
/*                           Submission Validators                            */
/* -------------------------------------------------------------------------- */

// Create Submission
export const createSubmissionSchema = z.object({
  assignment: z
    .string()
    .trim()
    .min(1),

  enrollment: z
    .string()
    .trim()
    .min(1),

  attachments: z
    .array(attachmentSchema)
    .min(
      1,
      "At least one attachment is required",
    ),
});

export type CreateSubmissionInput =
  z.infer<typeof createSubmissionSchema>;

// Grade Submission
export const gradeSubmissionSchema = z.object({
  marks: z
    .number()
    .min(0),

  feedback: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  status: z.nativeEnum(
    SubmissionStatus,
  ),
});

export type GradeSubmissionInput =
  z.infer<typeof gradeSubmissionSchema>;

/* -------------------------------------------------------------------------- */
/*                             Query Validators                               */
/* -------------------------------------------------------------------------- */

// Assignment Query
export const getAssignmentsQuerySchema =
  paginationSchema.extend({
    subject: z
      .string()
      .optional(),

    faculty: z
      .string()
      .optional(),

    section: z
      .string()
      .optional(),

    semester: z
      .string()
      .optional(),

    status: z
      .nativeEnum(AssignmentStatus)
      .optional(),

    sortBy: z
      .enum([
        "dueDate",
        "createdAt",
        "title",
      ])
      .default("createdAt"),
  });

export type GetAssignmentsQueryInput =
  z.infer<
    typeof getAssignmentsQuerySchema
  >;

// Submission Query
export const getSubmissionsQuerySchema =
  paginationSchema.extend({
    assignment: z
      .string()
      .optional(),

    enrollment: z
      .string()
      .optional(),

    status: z
      .nativeEnum(SubmissionStatus)
      .optional(),

    sortBy: z
      .enum([
        "submissionDate",
        "createdAt",
      ])
      .default("submissionDate"),
  });

export type GetSubmissionsQueryInput =
  z.infer<
    typeof getSubmissionsQuerySchema
  >;