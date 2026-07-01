import { Role } from "../../src/modules/roles/models/role.model";
const roles = [
    {
        name: "ADMIN",
        description: "System Administrator",
        permissions: ["*"],
        isSystem: true,
    },
    {
        name: "TEACHER",
        description: "Teacher",
        permissions: [],
        isSystem: true,
    },
    {
        name: "STUDENT",
        description: "Student",
        permissions: [],
        isSystem: true,
    },
    {
        name: "PARENT",
        description: "Parent",
        permissions: [],
        isSystem: true,
    },
];
export const seedRoles = async () => {
    for (const role of roles) {
        const exists = await Role.findOne({
            name: role.name,
        });

        if (!exists) {
            await Role.create(role);

            console.log(`✅ ${role.name} created`);
        }
    }
};