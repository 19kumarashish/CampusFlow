import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  DashboardResponseData,
  AdminDashboardData,
  FacultyDashboardData,
  StudentDashboardData,
} from "../types/dashboard.types";

export const getDashboard = async (): Promise<DashboardResponseData> => {
  const response = await api.get<ApiResponse<DashboardResponseData>>("/dashboard");
  return response.data.data;
};

export const getAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get<ApiResponse<AdminDashboardData>>("/dashboard/admin");
  return response.data.data;
};

export const getFacultyDashboard = async (
  facultyId: string
): Promise<FacultyDashboardData> => {
  const response = await api.get<ApiResponse<FacultyDashboardData>>(
    `/dashboard/faculty/${facultyId}`
  );
  return response.data.data;
};

export const getStudentDashboard = async (
  enrollmentId: string
): Promise<StudentDashboardData> => {
  const response = await api.get<ApiResponse<StudentDashboardData>>(
    `/dashboard/student/${enrollmentId}`
  );
  return response.data.data;
};
