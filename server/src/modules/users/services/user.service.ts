import { ApiError } from "@/utils/ApiError";
import { hashPassword } from "@/shared/security/bcrypt";
import { roleRepository as defaultRoleRepository } from "@/modules/roles/repositories/role.repository";
import { CreateUserInput, GetUsersQueryInput } from "../validators/user.validator";
import { userRepository as defaultUserRepository } from "../repositories/user.repository";

export class UserService {
    constructor(
        private userRepository = defaultUserRepository,
        private roleRepository = defaultRoleRepository,
        private hashFn = hashPassword,
    ) {}

    async createUser(data: CreateUserInput) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        const role = await this.roleRepository.findById(data.roleId);

        if (!role) {
            throw new ApiError(404, "Role not found");
        }

        const password = await this.hashFn(data.password);

        return await this.userRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password,
            role: role._id,
        });
    }

    async getUsers(query: GetUsersQueryInput) {
        return await this.userRepository.findAll(query);
    }
}

export const userService = new UserService();