import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} from "../api/section.api";
import type {
  GetSectionsParams,
  GetSectionsResponse,
  Section,
  CreateSectionInput,
  UpdateSectionInput,
} from "../types/section.types";

export const useSectionsQuery = (params?: GetSectionsParams) => {
  return useQuery<GetSectionsResponse, Error>({
    queryKey: ["sections", params],
    queryFn: () => getSections(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000, // 45 seconds stale time
  });
};

export const useSectionQuery = (id: string, enabled = true) => {
  return useQuery<Section, Error>({
    queryKey: ["sections", id],
    queryFn: () => getSectionById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Section, Error, CreateSectionInput>({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      // Invalidate dashboard to sync section counts
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Section created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create section.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Section, Error, { id: string; data: UpdateSectionInput }>({
    mutationFn: ({ id, data }) => updateSection(id, data),
    onSuccess: (updatedSection, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["sections", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Section updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update section.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Section deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate section.";
      toast.error(errorMessage);
    },
  });
};
