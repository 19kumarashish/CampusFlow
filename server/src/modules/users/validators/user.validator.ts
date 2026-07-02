import { z } from "zod";

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
    .enum([
      "ACTIVE",
      "INACTIVE",
      "SUSPENDED",
      "PENDING",
    ])
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

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  search: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum([
      "ACTIVE",
      "INACTIVE",
      "SUSPENDED",
      "PENDING",
    ])
    .optional(),

  role: z.string().optional(),

  sort: z
    .string()
    .default("-createdAt"),
});

export type GetUsersQueryInput =
  z.infer<typeof getUsersQuerySchema>;

export type CreateUserInput =
  z.infer<typeof createUserSchema>;

export type UpdateUserInput =
  z.infer<typeof updateUserSchema>;

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;