import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";

export const promoteStudents = async (data: {
  studentIds: string[];
  fromSemesterId: string;
  toSemesterId: string;
  academicYear: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/academic/promotions/promote", data);
  return response.data.data;
};

export const getPromotionHistory = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/academic/promotions/history");
  return response.data.data;
};

export const getBacklogs = async (params?: { studentId?: string; status?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/academic/backlogs", { params });
  return response.data.data;
};

export const createBacklog = async (data: {
  student: string;
  subject: string;
  originalSemester: string;
  attempts?: number;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/academic/backlogs", data);
  return response.data.data;
};

export const clearBacklog = async (id: string): Promise<any> => {
  const response = await api.patch<ApiResponse<any>>(`/academic/backlogs/${id}/clear`);
  return response.data.data;
};

export const getRevaluations = async (params?: { studentId?: string; status?: string }): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/academic/revaluations", { params });
  return response.data.data;
};

export const createRevaluation = async (data: {
  student: string;
  result: string;
  subject: string;
  originalMarks: number;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/academic/revaluations", data);
  return response.data.data;
};

export const approveRevaluation = async (id: string, data: {
  revaluedMarks: number;
  status: "APPROVED" | "REJECTED";
}): Promise<any> => {
  const response = await api.patch<ApiResponse<any>>(`/academic/revaluations/${id}/approve`, data);
  return response.data.data;
};

export const getAcademicEvents = async (): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>("/academic/calendar");
  return response.data.data;
};

export const createAcademicEvent = async (data: {
  title: string;
  category: "EXAM" | "HOLIDAY" | "WORKSHOP" | "ACTIVITY";
  startDate: string;
  endDate: string;
  description?: string;
  isRecurring?: boolean;
  recurringType?: string;
}): Promise<any> => {
  const response = await api.post<ApiResponse<any>>("/academic/calendar", data);
  return response.data.data;
};

export const updateAcademicEvent = async (id: string, data: Partial<{
  title: string;
  category: "EXAM" | "HOLIDAY" | "WORKSHOP" | "ACTIVITY";
  startDate: string;
  endDate: string;
  description?: string;
  isRecurring?: boolean;
  recurringType?: string;
}>): Promise<any> => {
  const response = await api.patch<ApiResponse<any>>(`/academic/calendar/${id}`, data);
  return response.data.data;
};

export const deleteAcademicEvent = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/academic/calendar/${id}`);
};
