import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetExaminationsParams,
  GetExaminationsResponse,
  Examination,
  CreateExaminationInput,
  UpdateExaminationInput,
  CreateExamResultInput,
  GetExamResultsParams,
  GetExamResultsResponse,
  ExamResult,
  UpdateExamResultInput,
} from "../types/examination.types";

export const getExaminations = async (
  params?: GetExaminationsParams
): Promise<GetExaminationsResponse> => {
  const response = await api.get<ApiResponse<GetExaminationsResponse>>("/examinations", {
    params,
  });
  return response.data.data;
};

export const getExaminationById = async (id: string): Promise<Examination> => {
  const response = await api.get<ApiResponse<Examination>>(`/examinations/${id}`);
  return response.data.data;
};

export const createExamination = async (
  data: CreateExaminationInput
): Promise<Examination> => {
  const response = await api.post<ApiResponse<Examination>>("/examinations", data);
  return response.data.data;
};

export const updateExamination = async (
  id: string,
  data: UpdateExaminationInput
): Promise<Examination> => {
  const response = await api.patch<ApiResponse<Examination>>(
    `/examinations/${id}`,
    data
  );
  return response.data.data;
};

export const deleteExamination = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/examinations/${id}`);
};

export const createExamResult = async (
  data: CreateExamResultInput
): Promise<ExamResult> => {
  const response = await api.post<ApiResponse<ExamResult>>("/examinations/results", data);
  return response.data.data;
};

export const getExamResults = async (
  params?: GetExamResultsParams
): Promise<GetExamResultsResponse> => {
  const response = await api.get<ApiResponse<GetExamResultsResponse>>("/examinations/results", {
    params,
  });
  return response.data.data;
};

export const updateExamResult = async (
  id: string,
  data: UpdateExamResultInput
): Promise<ExamResult> => {
  const response = await api.patch<ApiResponse<ExamResult>>(
    `/examinations/results/${id}`,
    data
  );
  return response.data.data;
};
