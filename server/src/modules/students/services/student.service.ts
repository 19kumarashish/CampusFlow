import { Types } from "mongoose";

import { courseRepository as defaultCourseRepository } from "@/modules/courses/repositories/course.repository";
import { departmentRepository as defaultDepartmentRepository } from "@/modules/departments/repositories/department.repository";
import { roleRepository as defaultRoleRepository } from "@/modules/roles/repositories/role.repository";
import { userRepository as defaultUserRepository } from "@/modules/users/repositories/user.repository";
import { UserRole } from "@/shared/enums/user-role.enum";
import { ApiError } from "@/utils/ApiError";

import { IStudent } from "../models/student.interface";
import { studentRepository as defaultStudentRepository } from "../repositories/student.repository";
import {
  CreateStudentInput,
  GetStudentsQueryInput,
  UpdateStudentInput,
} from "../validators/student.validator";

export class StudentService {
  constructor(
    private studentRepository = defaultStudentRepository,
    private userRepository = defaultUserRepository,
    private departmentRepository = defaultDepartmentRepository,
    private courseRepository = defaultCourseRepository,
    private roleRepository = defaultRoleRepository,
  ) {}

  /**
   * Create Student
   */
  async createStudent(
    data: CreateStudentInput,
  ) {
    const user =
      await this.userRepository.findById(
        data.user,
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found",
      );
    }

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

    const course =
      await this.courseRepository.findById(
        data.course,
      );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found",
      );
    }

    if (
      course.department.toString() !==
      data.department
    ) {
      throw new ApiError(
        400,
        "Selected course does not belong to the selected department",
      );
    }

    if (
      data.currentSemester >
      course.totalSemesters
    ) {
      throw new ApiError(
        400,
        `Course has only ${course.totalSemesters} semesters`,
      );
    }

    const existingStudent =
      await this.studentRepository.findByUser(
        data.user,
      );

    if (existingStudent) {
      throw new ApiError(
        409,
        "Student profile already exists",
      );
    }

    const studentIdExists =
      await this.studentRepository.findByStudentId(
        data.studentId,
      );

    if (studentIdExists) {
      throw new ApiError(
        409,
        "Student ID already exists",
      );
    }

    const registrationExists =
      await this.studentRepository.findByRegistrationNumber(
        data.registrationNumber,
      );

    if (registrationExists) {
      throw new ApiError(
        409,
        "Registration number already exists",
      );
    }

    const rollExists =
      await this.studentRepository.findByRollNumber(
        data.rollNumber,
      );

    if (rollExists) {
      throw new ApiError(
        409,
        "Roll number already exists",
      );
    }

    const studentRole =
      await this.roleRepository.findByName(
        UserRole.STUDENT,
      );

    if (!studentRole) {
      throw new ApiError(
        500,
        "Student role not found",
      );
    }

    if (
      user.role.toString() !==
      studentRole._id.toString()
    ) {
      throw new ApiError(
        400,
        "User must have STUDENT role",
      );
    }

    return this.studentRepository.create({
      ...data,
      user: new Types.ObjectId(data.user),
      department: new Types.ObjectId(data.department),
      course: new Types.ObjectId(data.course),
    });
  }

  /**
   * Get All Students
   */
  async getStudents(
    query: GetStudentsQueryInput,
  ) {
    return this.studentRepository.findAll(
      query,
    );
  }

  /**
   * Get Student By ID
   */
  async getStudentById(id: string) {
    const student =
      await this.studentRepository.findById(
        id,
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found",
      );
    }

    return student;
  }

  /**
   * Update Student
   */
  async updateStudent(
    id: string,
    data: UpdateStudentInput,
  ) {
    const student =
      await this.studentRepository.findById(
        id,
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found",
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

    if (data.course) {
      const course =
        await this.courseRepository.findById(
          data.course,
        );

      if (!course) {
        throw new ApiError(
          404,
          "Course not found",
        );
      }

      const departmentId =
        data.department ??
        student.department.toString();

      if (
        course.department.toString() !==
        departmentId
      ) {
        throw new ApiError(
          400,
          "Selected course does not belong to the selected department",
        );
      }

      const semester =
        data.currentSemester ??
        student.currentSemester;

      if (
        semester >
        course.totalSemesters
      ) {
        throw new ApiError(
          400,
          `Course has only ${course.totalSemesters} semesters`,
        );
      }
    }

    if (
      data.studentId &&
      data.studentId !==
        student.studentId
    ) {
      const exists =
        await this.studentRepository.findByStudentId(
          data.studentId,
        );

      if (exists) {
        throw new ApiError(
          409,
          "Student ID already exists",
        );
      }
    }

    if (
      data.registrationNumber &&
      data.registrationNumber !==
        student.registrationNumber
    ) {
      const exists =
        await this.studentRepository.findByRegistrationNumber(
          data.registrationNumber,
        );

      if (exists) {
        throw new ApiError(
          409,
          "Registration number already exists",
        );
      }
    }

    if (
      data.rollNumber &&
      data.rollNumber !==
        student.rollNumber
    ) {
      const exists =
        await this.studentRepository.findByRollNumber(
          data.rollNumber,
        );

      if (exists) {
        throw new ApiError(
          409,
          "Roll number already exists",
        );
      }
    }

    const updateData: Partial<IStudent> = {};
    if (data.studentId !== undefined) updateData.studentId = data.studentId;
    if (data.registrationNumber !== undefined) updateData.registrationNumber = data.registrationNumber;
    if (data.rollNumber !== undefined) updateData.rollNumber = data.rollNumber;
    if (data.currentSemester !== undefined) updateData.currentSemester = data.currentSemester;
    if (data.admissionYear !== undefined) updateData.admissionYear = data.admissionYear;
    if (data.admissionType !== undefined) updateData.admissionType = data.admissionType;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.bloodGroup !== undefined) updateData.bloodGroup = data.bloodGroup;
    if (data.guardianName !== undefined) updateData.guardianName = data.guardianName;
    if (data.guardianPhone !== undefined) updateData.guardianPhone = data.guardianPhone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.status !== undefined) updateData.status = data.status;

    if (data.user !== undefined) updateData.user = new Types.ObjectId(data.user);
    if (data.department !== undefined) updateData.department = new Types.ObjectId(data.department);
    if (data.course !== undefined) updateData.course = new Types.ObjectId(data.course);

    return this.studentRepository.updateById(
      id,
      updateData,
    );
  }

  /**
   * Soft Delete Student
   */
  async deleteStudent(id: string) {
    const student =
      await this.studentRepository.findById(
        id,
      );

    if (!student) {
      throw new ApiError(
        404,
        "Student not found",
      );
    }

    if (student.deletedAt) {
      throw new ApiError(
        400,
        "Student already deleted",
      );
    }

    return this.studentRepository.softDeleteById(
      id,
    );
  }
}

export const studentService =
  new StudentService();