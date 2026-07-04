import { Types } from "mongoose";

import { departmentRepository as defaultDepartmentRepository } from "@/modules/departments/repositories/department.repository";
import { roleRepository as defaultRoleRepository } from "@/modules/roles/repositories/role.repository";
import { userRepository as defaultUserRepository } from "@/modules/users/repositories/user.repository";
import { UserRole } from "@/shared/enums/user-role.enum";
import { ApiError } from "@/utils/ApiError";

import { IFaculty } from "../models/faculty.interface";
import { facultyRepository as defaultFacultyRepository } from "../repositories/faculty.repository";
import {
  CreateFacultyInput,
  GetFacultiesQueryInput,
  UpdateFacultyInput,
} from "../validators/faculty.validator";

export class FacultyService {
  constructor(
    private facultyRepository = defaultFacultyRepository,
    private userRepository = defaultUserRepository,
    private departmentRepository = defaultDepartmentRepository,
    private roleRepository = defaultRoleRepository,
  ) {}

  async createFaculty(data: CreateFacultyInput) {
    const user = await this.userRepository.findById(data.user);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const department = await this.departmentRepository.findById(
      data.department,
    );

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const existingFaculty =
      await this.facultyRepository.findByUser(data.user);

    if (existingFaculty) {
      throw new ApiError(
        409,
        "Faculty profile already exists",
      );
    }

    const employeeExists =
      await this.facultyRepository.findByEmployeeId(
        data.employeeId,
      );

    if (employeeExists) {
      throw new ApiError(
        409,
        "Employee ID already exists",
      );
    }

    const facultyRole =
      await this.roleRepository.findByName(
        UserRole.TEACHER,
      );

    if (!facultyRole) {
      throw new ApiError(
        500,
        "Teacher role not found",
      );
    }

    if (
      user.role.toString() !==
      facultyRole._id.toString()
    ) {
      throw new ApiError(
        400,
        "User must have TEACHER role",
      );
    }

    return this.facultyRepository.create({
      ...data,
      user: new Types.ObjectId(data.user),
      department: new Types.ObjectId(data.department),
    });
  }

  async getFaculties(
    query: GetFacultiesQueryInput,
  ) {
    return this.facultyRepository.findAll(query);
  }

  async getFacultyById(id: string) {
    const faculty =
      await this.facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    return faculty;
  }

  async updateFaculty(
    id: string,
    data: UpdateFacultyInput,
  ) {
    const faculty =
      await this.facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    if (data.department) {
      const department =
        await this.departmentRepository.findById(
          data.department,
        );

      if (!department) {
        throw new ApiError(
          404,
          "Department not found",
        );
      }
    }

    if (
      data.employeeId &&
      data.employeeId !== faculty.employeeId
    ) {
      const exists =
        await this.facultyRepository.findByEmployeeId(
          data.employeeId,
        );

      if (exists) {
        throw new ApiError(
          409,
          "Employee ID already exists",
        );
      }
    }

    const updateData: Partial<IFaculty> = {};
    if (data.employeeId !== undefined) updateData.employeeId = data.employeeId;
    if (data.designation !== undefined) updateData.designation = data.designation;
    if (data.qualification !== undefined) updateData.qualification = data.qualification;
    if (data.specialization !== undefined) updateData.specialization = data.specialization;
    if (data.experience !== undefined) updateData.experience = data.experience;
    if (data.joiningDate !== undefined) updateData.joiningDate = data.joiningDate;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
    if (data.status !== undefined) updateData.status = data.status;

    if (data.user !== undefined) {
      updateData.user = new Types.ObjectId(data.user);
    }
    if (data.department !== undefined) {
      updateData.department = new Types.ObjectId(data.department);
    }

    return this.facultyRepository.updateById(
      id,
      updateData,
    );
  }

  async deleteFaculty(id: string) {
    const faculty =
      await this.facultyRepository.findById(id);

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    if (faculty.deletedAt) {
      throw new ApiError(
        400,
        "Faculty already deleted",
      );
    }

    return this.facultyRepository.softDeleteById(
      id,
    );
  }
}

export const facultyService = new FacultyService();