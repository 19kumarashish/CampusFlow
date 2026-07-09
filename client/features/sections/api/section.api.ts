import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  GetSectionsParams,
  GetSectionsResponse,
  Section,
  CreateSectionInput,
  UpdateSectionInput,
} from "../types/section.types";

export const getSections = async (
  params?: GetSectionsParams
): Promise<GetSectionsResponse> => {
  const response = await api.get<ApiResponse<GetSectionsResponse>>("/sections", {
    params,
  });
  return response.data.data;
};

export const getSectionById = async (id: string): Promise<Section> => {
  const response = await api.get<ApiResponse<Section>>(`/sections/${id}`);
  return response.data.data;
};

export const createSection = async (
  data: CreateSectionInput
): Promise<Section> => {
  const response = await api.post<ApiResponse<Section>>("/sections", data);
  return response.data.data;
};

export const updateSection = async (
  id: string,
  data: UpdateSectionInput
): Promise<Section> => {
  const response = await api.patch<ApiResponse<Section>>(
    `/sections/${id}`,
    data
  );
  return response.data.data;
};

export const deleteSection = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<null>>(`/sections/${id}`);
};
