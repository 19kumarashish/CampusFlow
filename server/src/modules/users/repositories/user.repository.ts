import { IUser } from "../models/user.interface";
import { User } from "../models/user.model";
import { GetUsersQueryInput } from "../validators/user.validator";

class UserRepository {
  async create(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id).populate("role");
  }

  async findAll(query: GetUsersQueryInput) {
    const {
      page,
      limit,
      search,
      status,
      role,
      sort,
    } = query;

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          firstName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate("role")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateById(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("role");
  }

  async deleteById(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        status: "INACTIVE",
      },
      {
        new: true,
      },
    );
  }
}

export const userRepository = new UserRepository();