import { z } from "zod";

import { Designation } from "@/shared/enums/designation.enum";
import { EmploymentType } from "@/shared/enums/employment-type.enum";
import { Status } from "@/shared/enums/status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createFacultySchema = z.object({
  user: z
    .string()
    .trim()
    .min(1, "User is required"),

  employeeId: z
    .string()
    .trim()
    .min(2, "Employee ID must be at least 2 characters.")
    .max(20, "Employee ID cannot exceed 20 characters.")
    .transform((value) => value.toUpperCase()),

  department: z
    .string()
    .trim()
    .min(1, "Department is required"),

  designation: z.nativeEnum(Designation),

  qualification: z
    .string()
    .trim()
    .min(2, "Qualification must be at least 2 characters.")
    .max(100, "Qualification cannot exceed 100 characters."),

  specialization: z
    .string()
    .trim()
    .min(2, "Specialization must be at least 2 characters.")
    .max(100, "Specialization cannot exceed 100 characters."),

  experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative.")
    .max(60, "Experience cannot exceed 60 years."),

  joiningDate: z.coerce.date(),

  employmentType: z.nativeEnum(EmploymentType),
});

export type CreateFacultyInput = z.infer<
  typeof createFacultySchema
>;

export const updateFacultySchema = z.object({
  user: z
    .string()
    .trim()
    .optional(),

  employeeId: z
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

  designation: z
    .nativeEnum(Designation)
    .optional(),

  qualification: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  specialization: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  experience: z.coerce
    .number()
    .min(0)
    .max(60)
    .optional(),

  joiningDate: z.coerce
    .date()
    .optional(),

  employmentType: z
    .nativeEnum(EmploymentType)
    .optional(),

  status: z
    .nativeEnum(Status)
    .optional(),
});

export type UpdateFacultyInput = z.infer<
  typeof updateFacultySchema
>;

export const getFacultiesQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    department: z
      .string()
      .trim()
      .optional(),

    designation: z
      .nativeEnum(Designation)
      .optional(),

    employmentType: z
      .nativeEnum(EmploymentType)
      .optional(),

    status: z
      .nativeEnum(Status)
      .optional(),

    sortBy: z
      .enum([
        "employeeId",
        "designation",
        "joiningDate",
        "experience",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type GetFacultiesQueryInput = z.infer<
  typeof getFacultiesQuerySchema
>;