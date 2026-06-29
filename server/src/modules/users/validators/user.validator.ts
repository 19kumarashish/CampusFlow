import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().min(2).max(50),

  email: z.string().trim().email(),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),

  password: z
    .string()
    .min(8)
    .max(32)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});