import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().trim().min(1).default("dev-access-secret-change-me"),

  JWT_REFRESH_SECRET: z.string().trim().min(1).default("dev-refresh-secret-change-me"),

  SMTP_HOST: z.string().default("localhost"),

  SMTP_PORT: z.coerce.number().default(587),

  SMTP_USER: z.string().optional(),

  SMTP_PASSWORD: z.string().optional(),

  MAIL_FROM: z.string().default("CampusFlow <noreply@campusflow.com>"),

  MAIL_HOST: z.string().optional(),

  MAIL_PORT: z.coerce.number().optional(),

  MAIL_USER: z.string().optional(),

  MAIL_PASS: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  MAIL_HOST: parsed.MAIL_HOST || parsed.SMTP_HOST,
  MAIL_PORT: parsed.MAIL_PORT || parsed.SMTP_PORT,
  MAIL_USER: parsed.MAIL_USER || parsed.SMTP_USER,
  MAIL_PASS: parsed.MAIL_PASS || parsed.SMTP_PASSWORD,
};