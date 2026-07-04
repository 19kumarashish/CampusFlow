import { z } from "zod";

import { UserStatus } from "@/shared/enums/user-status.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(50),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(),

  phone: z
    .string()
    .trim()
    .min(10)
    .max(15),

  password: z
    .string()
    .min(8),

  roleId: z
    .string()
    .trim()
    .min(1),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .optional(),

  password: z
    .string()
    .min(8)
    .max(32)
    .optional(),

  avatar: z
    .string()
    .url()
    .optional(),

  roleId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  status: z
    .nativeEnum(UserStatus)
    .optional(),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .optional(),

  avatar: z
    .string()
    .url()
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8)
    .max(32),

  newPassword: z
    .string()
    .min(8)
    .max(32),
});

export const getUsersQuerySchema =
  paginationSchema.extend({
    search: z
      .string()
      .trim()
      .optional(),

    status: z
      .nativeEnum(UserStatus)
      .optional(),

    role: z
      .string()
      .trim()
      .optional(),

    sortBy: z
      .enum([
        "firstName",
        "lastName",
        "email",
        "createdAt",
      ])
      .default("createdAt"),
  });

export type CreateUserInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;

export type GetUsersQueryInput =
  z.infer<typeof getUsersQuerySchema>;