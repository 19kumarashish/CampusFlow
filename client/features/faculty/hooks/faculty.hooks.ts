import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../api/faculty.api";
import type {
  GetFacultiesParams,
  GetFacultiesResponse,
  Faculty,
  CreateFacultyInput,
  UpdateFacultyInput,
} from "../types/faculty.types";

export const useFacultiesQuery = (params?: GetFacultiesParams) => {
  return useQuery<GetFacultiesResponse, Error>({
    queryKey: ["faculties", params],
    queryFn: () => getFaculties(params),
    placeholderData: (prev) => prev,
    staleTime: 45 * 1000, // 45 seconds stale time
  });
};

export const useFacultyQuery = (id: string, enabled = true) => {
  return useQuery<Faculty, Error>({
    queryKey: ["faculties", id],
    queryFn: () => getFacultyById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Faculty, Error, CreateFacultyInput>({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      // Invalidate dashboard to sync faculty aggregations
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Faculty profile created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create faculty profile.";
      toast.error(errorMessage);
    },
  });
};

export const useUpdateFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Faculty, Error, { id: string; data: UpdateFacultyInput }>({
    mutationFn: ({ id, data }) => updateFaculty(id, data),
    onSuccess: (updatedFaculty, variables) => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["faculties", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Faculty profile updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update faculty profile.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteFacultyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Faculty profile deactivated successfully (Soft Deleted)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to deactivate faculty profile.";
      toast.error(errorMessage);
    },
  });
};
