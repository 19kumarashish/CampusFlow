import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetSubjectsParams,
  GetSubjectsResponse,
  Subject,
  CreateSubjectInput,
  UpdateSubjectInput,
} from "../types/subject.types";

export const getSubjects = async (
  params?: GetSubjectsParams
): Promise<GetSubjectsResponse> => {
  const response = await api.get<ApiResponse<GetSubjectsResponse>>("/subjects", {
    params,
  });
  return response.data.data;
};

export const getSubjectById = async (id: string): Promise<Subject> => {
  const response = await api.get<ApiResponse<Subject>>(`/subjects/${id}`);
  return response.data.data;
};

export const createSubject = async (
  data: CreateSubjectInput
): Promise<Subject> => {
  const response = await api.post<ApiResponse<Subject>>("/subjects", data);
  return response.data.data;
};

export const updateSubject = async (
  id: string,
  data: UpdateSubjectInput
): Promise<Subject> => {
  const response = await api.patch<ApiResponse<Subject>>(
    `/subjects/${id}`,
    data
  );
  return response.data.data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/subjects/${id}`);
};
