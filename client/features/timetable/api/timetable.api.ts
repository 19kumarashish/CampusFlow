import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetTimetableParams,
  GetTimetableResponse,
  Timetable,
  CreateTimetableInput,
  UpdateTimetableInput,
} from "../types/timetable.types";

export const getTimetables = async (
  params?: GetTimetableParams
): Promise<GetTimetableResponse> => {
  const response = await api.get<ApiResponse<GetTimetableResponse>>("/timetable", {
    params,
  });
  return response.data.data;
};

export const getTimetableById = async (id: string): Promise<Timetable> => {
  const response = await api.get<ApiResponse<Timetable>>(`/timetable/${id}`);
  return response.data.data;
};

export const createTimetable = async (
  data: CreateTimetableInput
): Promise<Timetable> => {
  const response = await api.post<ApiResponse<Timetable>>("/timetable", data);
  return response.data.data;
};

export const updateTimetable = async (
  id: string,
  data: UpdateTimetableInput
): Promise<Timetable> => {
  const response = await api.patch<ApiResponse<Timetable>>(
    `/timetable/${id}`,
    data
  );
  return response.data.data;
};

export const deleteTimetable = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/timetable/${id}`);
};
