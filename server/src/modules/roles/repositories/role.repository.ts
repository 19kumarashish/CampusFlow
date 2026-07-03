import { Role } from "@/modules/roles/models/role.model";

import { IRole } from "../models/role.interface";

export class RoleRepository {
  async findById(id: string) {
    return Role.findById(id);
  }

  async findByName(name: string) {
    return Role.findOne({ name });
  }

  async findAll() {
    return Role.find();
  }

  async create(data: Partial<IRole>) {
    return Role.create(data);
  }
}

export const roleRepository = new RoleRepository();