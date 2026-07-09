import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetEnrollmentsParams,
  GetEnrollmentsResponse,
  Enrollment,
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from "../types/enrollment.types";

export const getEnrollments = async (
  params?: GetEnrollmentsParams
): Promise<GetEnrollmentsResponse> => {
  const response = await api.get<ApiResponse<GetEnrollmentsResponse>>(
    "/enrollments",
    { params }
  );
  return response.data.data;
};

export const getEnrollmentById = async (id: string): Promise<Enrollment> => {
  const response = await api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`);
  return response.data.data;
};

export const createEnrollment = async (
  data: CreateEnrollmentInput
): Promise<Enrollment> => {
  const response = await api.post<ApiResponse<Enrollment>>("/enrollments", data);
  return response.data.data;
};

export const updateEnrollment = async (
  id: string,
  data: UpdateEnrollmentInput
): Promise<Enrollment> => {
  const response = await api.patch<ApiResponse<Enrollment>>(
    `/enrollments/${id}`,
    data
  );
  return response.data.data;
};

export const deleteEnrollment = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/enrollments/${id}`);
};
