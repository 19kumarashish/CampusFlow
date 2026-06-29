import { Role } from "@/modules/roles/models/role.model";

export const seedRoles = async () => {
  const roles = [
    {
      name: "ADMIN",
      isSystem: true,
      permissions: ["*"],
    },
    {
      name: "TEACHER",
      isSystem: true,
      permissions: [],
    },
    {
      name: "STUDENT",
      isSystem: true,
      permissions: [],
    },
    {
      name: "PARENT",
      isSystem: true,
      permissions: [],
    },
  ];

  for (const role of roles) {
    await Role.updateOne(
      { name: role.name },
      role,
      { upsert: true },
    );
  }
};