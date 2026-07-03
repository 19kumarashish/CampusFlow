import { ApiError } from "@/utils/ApiError";

import { departmentRepository as defaultDepartmentRepository } from "../repositories/department.repository";
import {
  CreateDepartmentInput,
  GetDepartmentsQueryInput,
  UpdateDepartmentInput,
} from "../validators/department.validator";

export class DepartmentService {
  constructor(
    private departmentRepository = defaultDepartmentRepository,
  ) {}

  async createDepartment(
    data: CreateDepartmentInput,
  ) {
    const existingName =
      await this.departmentRepository.findByName(data.name);

    if (existingName) {
      throw new ApiError(
        409,
        "Department name already exists",
      );
    }

    const existingCode =
      await this.departmentRepository.findByCode(data.code);

    if (existingCode) {
      throw new ApiError(
        409,
        "Department code already exists",
      );
    }

    return this.departmentRepository.create(data);
  }

  async getDepartments(
    query: GetDepartmentsQueryInput,
  ) {
    return this.departmentRepository.findAll(query);
  }

  async getDepartmentById(id: string) {
    const department =
      await this.departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(
        404,
        "Department not found",
      );
    }

    return department;
  }

  async updateDepartment(
    id: string,
    data: UpdateDepartmentInput,
  ) {
    const department =
      await this.departmentRepository.findById(id);

    if (!department) {
      throw new ApiError(
        404,
        "Department not found",
      );
    }

    if (
      data.name &&
      data.name !== department.name
    ) {
      const existing =
        await this.departmentRepository.findByName(
          data.name,
        );

      if (existing) {
        throw new ApiError(
          409,
          "Department name already exists",
        );
      }
    }

    if (
      data.code &&
      data.code !== department.code
    ) {
      const existing =
        await this.departmentRepository.findByCode(
          data.code,
        );

      if (existing) {
        throw new ApiError(
          409,
          "Department code already exists",
        );
      }
    }

    return this.departmentRepository.updateById(
      id,
      data,
    );
  }

  async deleteDepartment(id: string) {
    const department =
      await this.departmentRepository.findById(
        id,
      );

    if (!department) {
      throw new ApiError(
        404,
        "Department not found",
      );
    }

    if (department.deletedAt) {
      throw new ApiError(
        400,
        "Department is already deleted",
      );
    }

    return this.departmentRepository.softDeleteById(
      id,
    );
  }
}

export const departmentService =
  new DepartmentService();