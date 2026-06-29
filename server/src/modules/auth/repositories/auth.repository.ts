import { User } from "@/modules/users/models/user.model";

class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({ email }).select("+password").populate("role");
  }

  async updateLastLogin(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      },
    );
  }
}

export const authRepository = new AuthRepository();