import { z } from "zod";

import { AdmissionType } from "@/shared/enums/admission-type.enum";
import { BloodGroup } from "@/shared/enums/blood-group.enum";
import { Gender } from "@/shared/enums/gender.enum";
import { StudentStatus } from "@/shared/enums/student-status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";
export const createStudentSchema = z.object({
  user: z
    .string()
    .trim()
    .min(1, "User is required"),

  studentId: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  registrationNumber: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),

  rollNumber: z
    .string()
    .trim()
    .min(1)
    .max(20),

  department: z
    .string()
    .trim()
    .min(1),

  course: z
    .string()
    .trim()
    .min(1),

  currentSemester: z
    .number()
    .int()
    .min(1)
    .max(12),

  admissionYear: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear()),

  admissionType: z.nativeEnum(
    AdmissionType,
  ),

  dateOfBirth: z.coerce.date(),

  gender: z.nativeEnum(Gender),

  bloodGroup: z.nativeEnum(
    BloodGroup,
  ),

  guardianName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  guardianPhone: z
    .string()
    .trim()
    .min(10)
    .max(15),

  address: z
    .string()
    .trim()
    .min(5)
    .max(500),
});
export type CreateStudentInput =
  z.infer<
    typeof createStudentSchema
  >;
export const updateStudentSchema = z.object({
  user: z.string().trim().optional(),

  studentId: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase())
    .optional(),

  registrationNumber: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase())
    .optional(),

  rollNumber: z
    .string()
    .trim()
    .min(1)
    .max(20)
    .optional(),

  department: z
    .string()
    .trim()
    .optional(),

  course: z
    .string()
    .trim()
    .optional(),

  currentSemester: z
    .number()
    .int()
    .min(1)
    .max(12)
    .optional(),

  admissionYear: z
    .number()
    .int()
    .min(2000)
    .optional(),

  admissionType: z
    .nativeEnum(AdmissionType)
    .optional(),

  dateOfBirth: z
    .coerce
    .date()
    .optional(),

  gender: z
    .nativeEnum(Gender)
    .optional(),

  bloodGroup: z
    .nativeEnum(BloodGroup)
    .optional(),

  guardianName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  guardianPhone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .optional(),

  address: z
    .string()
    .trim()
    .min(5)
    .max(500)
    .optional(),

  status: z
    .nativeEnum(StudentStatus)
    .optional(),
});
export type UpdateStudentInput =
  z.infer<
    typeof updateStudentSchema
  >;
export const getStudentsQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    department: z
      .string()
      .trim()
      .optional(),

    course: z
      .string()
      .trim()
      .optional(),

    currentSemester: z
      .coerce
      .number()
      .int()
      .optional(),

    admissionYear: z
      .coerce
      .number()
      .int()
      .optional(),

    admissionType: z
      .nativeEnum(AdmissionType)
      .optional(),

    gender: z
      .nativeEnum(Gender)
      .optional(),

    status: z
      .nativeEnum(StudentStatus)
      .optional(),

    sortBy: z
      .enum([
        "studentId",
        "rollNumber",
        "currentSemester",
        "admissionYear",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type GetStudentsQueryInput =
  z.infer<
    typeof getStudentsQuerySchema
  >;
