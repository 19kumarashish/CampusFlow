import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetResultsParams,
  GetResultsResponse,
  SubjectResult,
  CreateResultInput,
  GetSemesterResultsParams,
  GetSemesterResultsResponse,
  SemesterResult,
  CreateSemesterResultInput,
  TranscriptResponse,
} from "../types/result.types";

export const getResults = async (
  params?: GetResultsParams
): Promise<GetResultsResponse> => {
  const response = await api.get<ApiResponse<GetResultsResponse>>("/results", {
    params,
  });
  return response.data.data;
};

export const createResult = async (
  data: CreateResultInput
): Promise<SubjectResult> => {
  const response = await api.post<ApiResponse<SubjectResult>>("/results", data);
  return response.data.data;
};

export const getSemesterResults = async (
  params?: GetSemesterResultsParams
): Promise<GetSemesterResultsResponse> => {
  const response = await api.get<ApiResponse<GetSemesterResultsResponse>>("/results/semester", {
    params,
  });
  return response.data.data;
};

export const generateSemesterResult = async (
  data: CreateSemesterResultInput
): Promise<SemesterResult> => {
  const response = await api.post<ApiResponse<SemesterResult>>("/results/semester", data);
  return response.data.data;
};

export const publishResult = async (id: string): Promise<SemesterResult> => {
  const response = await api.patch<ApiResponse<SemesterResult>>(`/results/${id}/publish`);
  return response.data.data;
};

export const generateTranscript = async (
  enrollmentId: string
): Promise<TranscriptResponse> => {
  const response = await api.get<ApiResponse<TranscriptResponse>>(`/results/transcript/${enrollmentId}`);
  return response.data.data;
};
