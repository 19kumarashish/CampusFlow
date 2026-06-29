import { IUser } from "@/modules/users/models/user.interface";
import { comparePassword } from "@/shared/security/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/shared/security/jwt";
import { ApiError } from "@/utils/ApiError";

import { authRepository } from "../repositories/auth.repository";
import { LoginInput } from "../validators/auth.validator";

export interface AuthLoginResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthRefreshResult {
  accessToken: string;
  user: IUser;
}

export class AuthService {
  async login(data: LoginInput): Promise<AuthLoginResult> {
    const { email, password } = data;

    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Account is not active");
    }

    const roleId = user.role.toString();

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      roleId,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      roleId,
      email: user.email,
    });

    await authRepository.updateLastLogin(user._id.toString());

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<AuthRefreshResult> {
    try {
      const payload = verifyRefreshToken(token);
      const user = await authRepository.findById(payload.userId);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (user.status !== "ACTIVE") {
        throw new ApiError(403, "Account is not active");
      }

      const accessToken = generateAccessToken({
        userId: user._id.toString(),
        roleId: user.role.toString(),
        email: user.email,
      });

      return {
        accessToken,
        user,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(401, "Invalid or expired refresh token");
    }
  }

  async logout(_token?: string): Promise<void> {
    return undefined;
  }

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}

export const authService = new AuthService();