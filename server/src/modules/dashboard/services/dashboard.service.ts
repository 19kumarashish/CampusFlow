import { enrollmentRepository as defaultEnrollmentRepository } from "@/modules/enrollments/repositories/enrollment.repository";
import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { UserRole } from "@/shared/enums/user-role.enum";
import { ApiError } from "@/utils/ApiError";

import { dashboardRepository as defaultDashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {
  constructor(
    private dashboardRepository =
      defaultDashboardRepository,

    private facultyRepository =
      defaultFacultyRepository,

    private enrollmentRepository =
      defaultEnrollmentRepository,
  ) {}

  // ==========================================
  // Admin Dashboard
  // ==========================================

  async getAdminDashboard() {
    return this.dashboardRepository.getAdminDashboard();
  }

  // ==========================================
  // Faculty Dashboard
  // ==========================================

  async getFacultyDashboard(
    facultyId: string,
  ) {
    const faculty =
      await this.facultyRepository.findById(
        facultyId,
      );

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    return this.dashboardRepository.getFacultyDashboard(
      facultyId,
    );
  }

  // ==========================================
  // Student Dashboard
  // ==========================================

  async getStudentDashboard(
    enrollmentId: string,
  ) {
    const enrollment =
      await this.enrollmentRepository.findById(
        enrollmentId,
      );

    if (!enrollment) {
      throw new ApiError(
        404,
        "Enrollment not found",
      );
    }

    return this.dashboardRepository.getStudentDashboard(
      enrollmentId,
    );
  }

  // ==========================================
  // Unified Dashboard
  // ==========================================

  async getDashboard(
    role: UserRole,
    id?: string,
  ) {
    switch (role) {
      case UserRole.ADMIN:
        return this.getAdminDashboard();

      case UserRole.TEACHER:
        if (!id) {
          throw new ApiError(
            400,
            "Faculty ID is required",
          );
        }

        return this.getFacultyDashboard(
          id,
        );

      case UserRole.STUDENT:
        if (!id) {
          throw new ApiError(
            400,
            "Enrollment ID is required",
          );
        }

        return this.getStudentDashboard(
          id,
        );

      default:
        throw new ApiError(
          403,
          "Unsupported dashboard role",
        );
    }
  }
}

export const dashboardService =
  new DashboardService();