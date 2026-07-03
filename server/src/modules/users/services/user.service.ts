import { roleRepository as defaultRoleRepository } from "@/modules/roles/repositories/role.repository";
import { UserStatus } from "@/shared/enums/user-status.enum";
import {
  comparePassword,
  hashPassword,
} from "@/shared/security/bcrypt";
import { ApiError } from "@/utils/ApiError";

import { IUser } from "../models/user.interface";
import { userRepository as defaultUserRepository } from "../repositories/user.repository";
import {
  ChangePasswordInput,
  CreateUserInput,
  GetUsersQueryInput,
  UpdateProfileInput,
  UpdateUserInput,
} from "../validators/user.validator";

export class UserService {
  constructor(
    private userRepository = defaultUserRepository,
    private roleRepository = defaultRoleRepository,
    private hashFn = hashPassword,
  ) { }

  async createUser(data: CreateUserInput) {
    const existingUser =
      await this.userRepository.findByEmail(
        data.email,
      );

    if (existingUser) {
      throw new ApiError(
        409,
        "Email already exists",
      );
    }

    const phoneExists =
      await this.userRepository.findByPhone(
        data.phone,
      );

    if (phoneExists) {
      throw new ApiError(
        409,
        "Phone number already exists",
      );
    }

    const role =
      await this.roleRepository.findById(
        data.roleId,
      );

    if (!role) {
      throw new ApiError(
        404,
        "Role not found",
      );
    }

    const password =
      await this.hashFn(data.password);

    return this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password,
      role: role._id,
    });
  }

  async getUsers(
    query: GetUsersQueryInput,
  ) {
    return this.userRepository.findAll(
      query,
    );
  }

  async getUserById(id: string) {
    const user =
      await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

    return user;
  }

  async updateUser(
    id: string,
    data: UpdateUserInput,
  ) {
    const existingUser =
      await this.userRepository.findById(id);

    if (!existingUser) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

    if (
      data.email &&
      data.email !== existingUser.email
    ) {
      const emailExists =
        await this.userRepository.findByEmail(
          data.email,
        );

      if (emailExists) {
        throw new ApiError(
          409,
          "Email already exists",
        );
      }
    }

    if (
      data.phone &&
      data.phone !== existingUser.phone
    ) {
      const phoneExists =
        await this.userRepository.findByPhone(
          data.phone,
        );

      if (phoneExists) {
        throw new ApiError(
          409,
          "Phone number already exists",
        );
      }
    }

    const updateData: Partial<IUser> = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.status) updateData.status = data.status as unknown as UserStatus;

    if (data.roleId) {
      const role =
        await this.roleRepository.findById(
          data.roleId,
        );

      if (!role) {
        throw new ApiError(
          404,
          "Role not found",
        );
      }

      updateData.role = role._id;
    }

    if (data.password) {
      updateData.password =
        await this.hashFn(data.password);
    }

    return this.userRepository.updateById(
      id,
      updateData,
    );
  }

  async deleteUser(id: string) {
    const user =
      await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

    if (user.status === "INACTIVE") {
      throw new ApiError(
        400,
        "User is already inactive",
      );
    }

    return this.userRepository.softDeleteById(
      id,
    );
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput,
  ) {
    const user =
      await this.userRepository.findByIdWithPassword(
        userId,
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

    const isPasswordValid =
      await comparePassword(
        data.currentPassword,
        user.password,
      );

    if (!isPasswordValid) {
      throw new ApiError(
        400,
        "Current password is incorrect",
      );
    }

    if (
      data.currentPassword ===
      data.newPassword
    ) {
      throw new ApiError(
        400,
        "New password must be different from current password",
      );
    }

    const hashedPassword =
      await this.hashFn(
        data.newPassword,
      );

    await this.userRepository.updatePassword(
      userId,
      hashedPassword,
    );

    return {
      message:
        "Password changed successfully",
    };
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ) {
    const user =
      await this.userRepository.findById(
        userId,
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

    if (
      data.phone &&
      data.phone !== user.phone
    ) {
      const phoneExists =
        await this.userRepository.findByPhone(
          data.phone,
        );

      if (phoneExists) {
        throw new ApiError(
          409,
          "Phone number already exists",
        );
      }
    }

    return this.userRepository.updateById(
      userId,
      data,
    );
  }
}

export const userService =
  new UserService();