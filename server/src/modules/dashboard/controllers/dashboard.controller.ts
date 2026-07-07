import { Request, Response } from "express";

import { Enrollment } from "@/modules/enrollments/models/enrollment.model";
import { facultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { studentRepository } from "@/modules/students/repositories/student.repository";
import { UserRole } from "@/shared/enums/user-role.enum";
import { AuthRequest } from "@/types/auth-request";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { dashboardService } from "../services/dashboard.service";

// ==========================================
// Admin Dashboard
// ==========================================

export const getAdminDashboard = asyncHandler(
  async (
    req: Request,
    res: Response,
  ) => {
    const dashboard =
      await dashboardService.getAdminDashboard();

    res.status(200).json(
      new ApiResponse(
        true,
        "Admin dashboard fetched successfully",
        dashboard,
      ),
    );
  },
);

// ==========================================
// Faculty Dashboard
// ==========================================

export const getFacultyDashboard =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const dashboard =
        await dashboardService.getFacultyDashboard(
          req.params.facultyId as string,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Faculty dashboard fetched successfully",
          dashboard,
        ),
      );
    },
  );

// ==========================================
// Student Dashboard
// ==========================================

export const getStudentDashboard =
  asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const dashboard =
        await dashboardService.getStudentDashboard(
          req.params.enrollmentId as string,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Student dashboard fetched successfully",
          dashboard,
        ),
      );
    },
  );

// ==========================================
// Unified Dashboard
// ==========================================

export const getDashboard =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
    ) => {
      const user = req.user;
      if (!user) {
        throw new ApiError(401, "Unauthorized");
      }

      const roleName =
        typeof user.role === "string"
          ? user.role
          : user.role && "name" in user.role
            ? user.role.name
            : user.role?.toString?.();

      let id: string | undefined;

      switch (roleName) {
        case UserRole.ADMIN:
          break;

        case UserRole.TEACHER: {
          const faculty = await facultyRepository.findByUser(user._id.toString());
          id = faculty?._id.toString();
          break;
        }

        case UserRole.STUDENT: {
          const student = await studentRepository.findByUser(user._id.toString());
          if (student) {
            const enrollment = await Enrollment.findOne({
              student: student._id,
              deletedAt: null,
            });
            id = enrollment?._id.toString();
          }
          break;
        }
      }

      const dashboard =
        await dashboardService.getDashboard(
          roleName as UserRole,
          id,
        );

      res.status(200).json(
        new ApiResponse(
          true,
          "Dashboard fetched successfully",
          dashboard,
        ),
      );
    },
  );