import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetAttendanceParams,
  GetAttendanceResponse,
  Attendance,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  AttendanceSummary,
} from "../types/attendance.types";

export const getAttendance = async (
  params?: GetAttendanceParams
): Promise<GetAttendanceResponse> => {
  const response = await api.get<ApiResponse<GetAttendanceResponse>>("/attendance", {
    params,
  });
  return response.data.data;
};

export const getAttendanceById = async (id: string): Promise<Attendance> => {
  const response = await api.get<ApiResponse<Attendance>>(`/attendance/${id}`);
  return response.data.data;
};

export const createAttendance = async (
  data: CreateAttendanceInput
): Promise<Attendance> => {
  const response = await api.post<ApiResponse<Attendance>>("/attendance", data);
  return response.data.data;
};

export const updateAttendance = async (
  id: string,
  data: UpdateAttendanceInput
): Promise<Attendance> => {
  const response = await api.patch<ApiResponse<Attendance>>(
    `/attendance/${id}`,
    data
  );
  return response.data.data;
};

export const deleteAttendance = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/attendance/${id}`);
};

export const getAttendanceSummary = async (
  enrollmentId: string
): Promise<AttendanceSummary> => {
  const response = await api.get<ApiResponse<AttendanceSummary>>(
    `/attendance/summary/${enrollmentId}`
  );
  return response.data.data;
};
