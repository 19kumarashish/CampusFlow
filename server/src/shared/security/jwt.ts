import jwt from "jsonwebtoken";

import { env } from "@/config/env";

export interface JwtPayload {
  userId: string;
  roleId: string;
  email: string;

}

export const generateAccessToken = (
  payload: JwtPayload,
) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (
  payload: JwtPayload,
) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};