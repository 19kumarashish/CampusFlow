import jwt from "jsonwebtoken";

import { env } from "@/config/env";

const verifyToken = (token: string, secret: string): JwtPayload => {
  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  });

  if (typeof payload === "string") {
    throw new Error("Invalid token payload");
  }

  if (!payload.userId || !payload.roleId || !payload.email) {
    throw new Error("Invalid token payload");
  }

  return payload as JwtPayload;
};

export interface JwtPayload {
  userId: string;
  roleId: string;
  email: string;
}

export const generateAccessToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
};

export const generateRefreshToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

export const verifyAccessToken = (
  token: string,
): JwtPayload => {
  return verifyToken(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (
  token: string,
): JwtPayload => {
  return verifyToken(token, env.JWT_REFRESH_SECRET);
};