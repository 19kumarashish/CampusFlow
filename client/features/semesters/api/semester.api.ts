import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetSemestersParams,
  GetSemestersResponse,
  Semester,
  CreateSemesterInput,
  UpdateSemesterInput,
} from "../types/semester.types";

export const getSemesters = async (
  params?: GetSemestersParams
): Promise<GetSemestersResponse> => {
  const response = await api.get<ApiResponse<GetSemestersResponse>>("/semesters", {
    params,
  });
  return response.data.data;
};

export const createSemester = async (
  data: CreateSemesterInput
): Promise<Semester> => {
  const response = await api.post<ApiResponse<Semester>>("/semesters", data);
  return response.data.data;
};

export const updateSemester = async (
  id: string,
  data: UpdateSemesterInput
): Promise<Semester> => {
  const response = await api.patch<ApiResponse<Semester>>(`/semesters/${id}`, data);
  return response.data.data;
};

export const deleteSemester = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/semesters/${id}`);
};
