import { expect } from "chai";

import type { RoleRepository } from "../src/modules/roles/repositories/role.repository";
import { User } from "../src/modules/users/models/user.model";
import type { UserRepository } from "../src/modules/users/repositories/user.repository";
import { userRepository } from "../src/modules/users/repositories/user.repository";
import { UserService } from "../src/modules/users/services/user.service";
import type { CreateUserInput } from "../src/modules/users/validators/user.validator";
import { ApiError } from "../src/utils/ApiError";

const baseUserData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "1234567890",
    password: "password123",
    roleId: "role-1",
};

describe("UserService", () => {
    it("creates a new user when email is available and role exists", async () => {
        const mockUserRepository = {
            findByEmail: async () => null,
            findByPhone: async () => null,
            create: async (data: Record<string, unknown>) => ({
                _id: "user-1",
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        } as unknown as UserRepository;

        const mockRoleRepository = {
            findById: async () => ({ _id: "role-1", name: "ADMIN" }),
        } as unknown as RoleRepository;

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password: string) => `hashed:${password}`,
        );

        const result = await service.createUser(baseUserData as CreateUserInput);

        expect(result).to.include({
            email: baseUserData.email,
            firstName: baseUserData.firstName,
            lastName: baseUserData.lastName,
            phone: baseUserData.phone,
            password: `hashed:${baseUserData.password}`,
        });
        expect(result.role).to.equal("role-1");
    });

    it("throws a conflict error when the email already exists", async () => {
        const mockUserRepository = {
            findByEmail: async () => ({ email: baseUserData.email }),
            findByPhone: async () => null,
            create: async () => null,
        } as unknown as UserRepository;

        const mockRoleRepository = {
            findById: async () => ({ _id: "role-1", name: "ADMIN" }),
        } as unknown as RoleRepository;

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password: string) => `hashed:${password}`,
        );

        try {
            await service.createUser(baseUserData as CreateUserInput);
            expect.fail("Expected createUser to throw ApiError");
        } catch (error: unknown) {
            const err = error as ApiError;
            expect(err).to.be.instanceOf(ApiError);
            expect(err.message).to.equal("Email already exists");
        }
    });

    it("throws a not found error when the role does not exist", async () => {
        const mockUserRepository = {
            findByEmail: async () => null,
            findByPhone: async () => null,
            create: async () => null,
        } as unknown as UserRepository;

        const mockRoleRepository = {
            findById: async () => null,
        } as unknown as RoleRepository;

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password: string) => `hashed:${password}`,
        );

        try {
            await service.createUser(baseUserData as CreateUserInput);
            expect.fail("Expected createUser to throw ApiError");
        } catch (error: unknown) {
            const err = error as ApiError;
            expect(err).to.be.instanceOf(ApiError);
            expect(err.message).to.equal("Role not found");
        }
    });

    it("finds a user by phone through the repository", async () => {
        const userModel = User as unknown as { findOne?: (...args: unknown[]) => Promise<Record<string, unknown>> };
        const originalFindOne = userModel.findOne;
        userModel.findOne = async () => ({ _id: "user-2", phone: baseUserData.phone });

        try {
            const result = await userRepository.findByPhone(baseUserData.phone);
            expect(result).to.deep.include({ phone: baseUserData.phone });
        } finally {
            userModel.findOne = originalFindOne;
        }
    });
});
