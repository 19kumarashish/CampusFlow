import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetDepartmentsParams,
  GetDepartmentsResponse,
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../types/department.types";

export const getDepartments = async (
  params?: GetDepartmentsParams
): Promise<GetDepartmentsResponse> => {
  const response = await api.get<ApiResponse<GetDepartmentsResponse>>(
    "/departments",
    { params }
  );
  return response.data.data;
};

export const getDepartmentById = async (id: string): Promise<Department> => {
  const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
  return response.data.data;
};

export const createDepartment = async (
  data: CreateDepartmentInput
): Promise<Department> => {
  const response = await api.post<ApiResponse<Department>>(
    "/departments",
    data
  );
  return response.data.data;
};

export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentInput
): Promise<Department> => {
  const response = await api.patch<ApiResponse<Department>>(
    `/departments/${id}`,
    data
  );
  return response.data.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/departments/${id}`);
};
