import { ApiError } from "@/utils/ApiError";
import { comparePassword } from "@/shared/security/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/shared/security/jwt";

import { authRepository } from "../repositories/auth.repository";
import { LoginInput } from "../validators/auth.validator";

export class AuthService {
  async login(data: LoginInput) {
    const { email, password } = data;

    // 1. Find user
    const user = await authRepository.findByEmail(email);

    // 2. Check user exists
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 3. Compare password
    const isPasswordValid = await comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // 4. Check account status
    if (user.status !== "ACTIVE") {
      throw new ApiError(
        403,
        "Account is not active",
      );
    }

    // 5. Generate tokens
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

    // 6. Update last login
    await authRepository.updateLastLogin(
      user._id.toString(),
    );

    // 7. Return user and tokens
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();