import { QueryBuilder } from "@/shared/builders/query.builder";
import { buildPaginationMeta } from "@/shared/utils/pagination";

import { IUser } from "../models/user.interface";
import { User } from "../models/user.model";
import { GetUsersQueryInput } from "../validators/user.validator";

export class UserRepository {
  async create(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByPhone(phone: string) {
    return User.findOne({ phone });
  }

  async findById(id: string) {
    return User.findById(id)
      .populate("role")
      .select("-password");
  }

  async findByIdWithPassword(id: string) {
    return User.findById(id)
      .select("+password")
      .populate("role");
  }

  async findAll(query: GetUsersQueryInput) {
    const { page, limit, status, role, sortBy, sortOrder } = query;

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (role) {
      filter.role = role;
    }

    const baseQuery = User.find(filter)
      .populate("role")
      .select("-password");

    const queryBuilder = new QueryBuilder(baseQuery, query, {
      defaultSortBy: sortBy ?? "createdAt",
      defaultSortOrder: sortOrder ?? "desc",
    });

    const [users, total] = await Promise.all([
      queryBuilder
        .search(["firstName", "lastName", "email"])
        .sort()
        .paginate(page, limit)
        .execute(),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: buildPaginationMeta(page, limit, total),
    };
  }

  async updateById(
    id: string,
    data: Partial<IUser>,
  ) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("role")
      .select("-password");
  }

  async softDeleteById(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "INACTIVE",
          deletedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("role")
      .select("-password");
  }

  async updatePassword(
    id: string,
    password: string,
  ) {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          password,
        },
      },
      {
        new: true,
      },
    );
  }
}

export const userRepository = new UserRepository();