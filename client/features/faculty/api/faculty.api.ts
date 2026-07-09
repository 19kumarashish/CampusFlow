import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetFacultiesParams,
  GetFacultiesResponse,
  Faculty,
  CreateFacultyInput,
  UpdateFacultyInput,
} from "../types/faculty.types";

export const getFaculties = async (
  params?: GetFacultiesParams
): Promise<GetFacultiesResponse> => {
  const response = await api.get<ApiResponse<GetFacultiesResponse>>(
    "/faculties",
    { params }
  );
  return response.data.data;
};

export const getFacultyById = async (id: string): Promise<Faculty> => {
  const response = await api.get<ApiResponse<Faculty>>(`/faculties/${id}`);
  return response.data.data;
};

export const createFaculty = async (
  data: CreateFacultyInput
): Promise<Faculty> => {
  const response = await api.post<ApiResponse<Faculty>>("/faculties", data);
  return response.data.data;
};

export const updateFaculty = async (
  id: string,
  data: UpdateFacultyInput
): Promise<Faculty> => {
  const response = await api.patch<ApiResponse<Faculty>>(
    `/faculties/${id}`,
    data
  );
  return response.data.data;
};

export const deleteFaculty = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/faculties/${id}`);
};
