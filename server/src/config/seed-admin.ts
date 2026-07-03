import { Role } from "@/modules/roles/models/role.model";
import { User } from "@/modules/users/models/user.model";
import { UserStatus } from "@/shared/enums/user-status.enum";
import { hashPassword } from "@/shared/security/bcrypt";

export const seedAdminUser = async () => {
    const role = await Role.findOne({ name: "ADMIN" });

    if (!role) {
        throw new Error("Admin role is missing. Run seedRoles first.");
    }

    const adminEmail = "admin@campusflow.com";
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
        return;
    }

    const password = await hashPassword("Admin@123");

    await User.create({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        phone: "0000000000",
        password,
        role: role._id,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
    });
};
