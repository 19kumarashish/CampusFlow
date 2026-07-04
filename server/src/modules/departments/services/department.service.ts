import { BaseService } from "@/shared/services/base.service";
import { ApiError } from "@/utils/ApiError";

import { departmentRepository as defaultDepartmentRepository } from "../repositories/department.repository";
import {
  CreateDepartmentInput,
  GetDepartmentsQueryInput,
  UpdateDepartmentInput,
} from "../validators/department.validator";

export class DepartmentService extends BaseService {
  constructor(
    private departmentRepository = defaultDepartmentRepository,
  ) {
    super();
  }

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

    return this.findOrFail(department, "Department");
  }

  async updateDepartment(
    id: string,
    data: UpdateDepartmentInput,
  ) {
    const department =
      await this.departmentRepository.findById(id);

    const existingDepartment = await this.findOrFail(department, "Department");

    if (
      data.name &&
      data.name !== existingDepartment.name
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
      data.code !== existingDepartment.code
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

    const existingDepartment = await this.findOrFail(department, "Department");
    await this.ensureNotDeleted(existingDepartment, "Department");

    return this.departmentRepository.softDeleteById(
      id,
    );
  }
}

export const departmentService =
  new DepartmentService();