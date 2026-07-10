import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetAssignmentsParams,
  GetAssignmentsResponse,
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  CreateSubmissionInput,
  Submission,
  GetSubmissionsParams,
  GetSubmissionsResponse,
  GradeSubmissionInput,
} from "../types/assignment.types";

export const getAssignments = async (
  params?: GetAssignmentsParams
): Promise<GetAssignmentsResponse> => {
  const response = await api.get<ApiResponse<GetAssignmentsResponse>>("/assignments", {
    params,
  });
  return response.data.data;
};

export const getAssignmentById = async (id: string): Promise<Assignment> => {
  const response = await api.get<ApiResponse<Assignment>>(`/assignments/${id}`);
  return response.data.data;
};

export const createAssignment = async (
  data: CreateAssignmentInput
): Promise<Assignment> => {
  const response = await api.post<ApiResponse<Assignment>>("/assignments", data);
  return response.data.data;
};

export const updateAssignment = async (
  id: string,
  data: UpdateAssignmentInput
): Promise<Assignment> => {
  const response = await api.patch<ApiResponse<Assignment>>(
    `/assignments/${id}`,
    data
  );
  return response.data.data;
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/assignments/${id}`);
};

export const submitAssignment = async (
  data: CreateSubmissionInput
): Promise<Submission> => {
  const response = await api.post<ApiResponse<Submission>>("/assignments/submit", data);
  return response.data.data;
};

export const getSubmissions = async (
  params?: GetSubmissionsParams
): Promise<GetSubmissionsResponse> => {
  const response = await api.get<ApiResponse<GetSubmissionsResponse>>("/assignments/submissions", {
    params,
  });
  return response.data.data;
};

export const gradeSubmission = async (
  id: string,
  data: GradeSubmissionInput
): Promise<Submission> => {
  const response = await api.patch<ApiResponse<Submission>>(
    `/assignments/submissions/${id}/grade`,
    data
  );
  return response.data.data;
};
