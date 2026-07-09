import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type { GetSemestersParams, GetSemestersResponse } from "../types/semester.types";

export const getSemesters = async (
  params?: GetSemestersParams
): Promise<GetSemestersResponse> => {
  const response = await api.get<ApiResponse<GetSemestersResponse>>("/semesters", {
    params,
  });
  return response.data.data;
};
