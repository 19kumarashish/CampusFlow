import { IUser } from "../models/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  async create(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async findAll() {
    return User.find();
  }

  async updateById(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();