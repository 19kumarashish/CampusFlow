import { ApiError } from "@/utils/ApiError";
import { comparePassword } from "@/shared/security/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/shared/security/jwt";

import { authRepository } from "../repositories/auth.repository";
import { LoginInput } from "../validators/auth.validator";

export class AuthService {
  // Login
  async login(data: LoginInput) {
    const { email, password } = data;

    // Find user
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Compare password
    const isPasswordValid = await comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check account status
    if (user.status !== "ACTIVE") {
      throw new ApiError(
        403,
        "Account is not active",
      );
    }

    // Generate tokens
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

    // Update last login
    await authRepository.updateLastLogin(
      user._id.toString(),
    );

    // Return response
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // Get current user
  async getCurrentUser(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}

export const authService = new AuthService();