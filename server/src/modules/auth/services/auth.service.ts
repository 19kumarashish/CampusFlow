import { ApiError } from "@/utils/ApiError";
import { comparePassword } from "@/shared/security/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/shared/security/jwt";

import { JwtPayload } from "jsonwebtoken";

import { authRepository } from "../repositories/auth.repository";
import { LoginInput } from "../validators/auth.validator";

export class AuthService {
  async login(data: LoginInput) {
    const { email, password } = data;

    // 1. Find user
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 2. Compare password
    const isPasswordValid = await comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 3. Check account status
    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Account is not active");
    }

    // 4. Generate Tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      roleId: user.role._id.toString(),
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      roleId: user.role._id.toString(),
      email: user.email,
    });

    // 5. Update last login
    await authRepository.updateLastLogin(
      user._id.toString(),
    );

    // 6. Return response
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required",
      );
    }

    const payload = verifyRefreshToken(
      refreshToken,
    ) as JwtPayload;

    const user = await authRepository.findById(
      payload.userId,
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(
        403,
        "Account is not active",
      );
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      roleId: user.role._id.toString(),
      email: user.email,
    });

    return {
      accessToken,
    };
  }
}

export const authService = new AuthService();