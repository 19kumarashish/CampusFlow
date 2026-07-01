const { expect } = require("chai");

const { ApiError } = require("../src/utils/ApiError");
const { UserService } = require("../src/modules/users/services/user.service");

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
            create: async (data) => ({
                _id: "user-1",
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        };

        const mockRoleRepository = {
            findById: async () => ({ _id: "role-1", name: "ADMIN" }),
        };

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password) => `hashed:${password}`,
        );

        const result = await service.createUser(baseUserData);

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
            create: async () => null,
        };

        const mockRoleRepository = {
            findById: async () => ({ _id: "role-1", name: "ADMIN" }),
        };

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password) => `hashed:${password}`,
        );

        try {
            await service.createUser(baseUserData);
            expect.fail("Expected createUser to throw ApiError");
        } catch (error) {
            expect(error).to.be.instanceOf(ApiError);
            expect(error.message).to.equal("Email already exists");
        }
    });

    it("throws a not found error when the role does not exist", async () => {
        const mockUserRepository = {
            findByEmail: async () => null,
            create: async () => null,
        };

        const mockRoleRepository = {
            findById: async () => null,
        };

        const service = new UserService(
            mockUserRepository,
            mockRoleRepository,
            async (password) => `hashed:${password}`,
        );

        try {
            await service.createUser(baseUserData);
            expect.fail("Expected createUser to throw ApiError");
        } catch (error) {
            expect(error).to.be.instanceOf(ApiError);
            expect(error.message).to.equal("Role not found");
        }
    });
});
