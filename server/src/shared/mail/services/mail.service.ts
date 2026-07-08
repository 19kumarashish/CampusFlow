import nodemailer from "nodemailer";

import { env } from "@/config/env";

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: Number(env.MAIL_PORT),
  secure: false, // true for port 465
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

class MailService {
  async send(options: SendMailOptions) {
    return transporter.sendMail({
      from: env.MAIL_FROM,
      ...options,
    });
  }
}

export const mailService = new MailService();