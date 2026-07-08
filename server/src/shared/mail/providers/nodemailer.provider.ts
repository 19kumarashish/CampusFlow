import nodemailer from "nodemailer";

import { env } from "@/config/env";

export const transporter =
    nodemailer.createTransport({
        host: env.MAIL_HOST,

        port: env.MAIL_PORT,

        secure: env.MAIL_PORT === 465,

        auth: {
            user: env.MAIL_USER,

            pass: env.MAIL_PASS,
        },
    });